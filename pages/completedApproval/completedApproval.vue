<template>
	<view>
		<view  class="cu-form-group margin-top">
			<view class="title">请选择查询的范围:</view>
			<picker @change="PickerChange" :value="index"  :range="arr">
				<view class="picker">
					{{ arr[index] }}天内
				</view>
			</picker>
		</view>
		<view class="box">
			<button v-if="completedApprovalList.length != 0" v-for="(item,index) in completedApprovalList" :key="index" type="primary" @click="toCompletedApprovalDetail(index)">{{ item.user.dept.dname }}--{{ item.user.chName }}--{{ item.approvalReason }}</button>		
			<button v-else  type="warn">该时间段没有完成的审批</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				days:3,
				arr:[3,15,30],
				index:0,
				completedApprovalList:[]
			}
		},
		
		onLoad(){
			
			this.loadData();
			
		},
		
		methods: {
			
			toCompletedApprovalDetail(index){
				
				uni.navigateTo({
					url:"../completedApprovalDetail/completedApprovalDetail?index="+index
				})
				
			},
			
			loadData(){
				
				uni.request({
					
					url:this.$serverUrl + '/event/getCompletedApprovalList',
					
					data:JSON.stringify({days:this.days}),
					
					method:"POST",
					
					header:{							
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {
						
						console.log(rs);					
						
						this.completedApprovalList = rs.data;
					}
				})
				
			},
			PickerChange(e) {
				
				//console.log("总经理id===="+e.detail.value)
				
				this.index = e.detail.value
				
				this.days = this.arr[this.index]
				
				console.log(this.days);
				
				this.loadData();
				
			},
		}
	}
</script>

<style>
.box{
		
		width: 100vw;	
			
		height: 100vh;		
		
		display: flex;
		
		justify-content: center;
		
		flex-wrap: wrap;
		
	}
	
	.box button{
		
		/* width: 60vw; */
		
		height: 100upx;
		
		
	}
</style>
