<template>
	<view class="margin-top">
		<view>		
			<view  class="box">
				<button v-if="approvalList != null"   v-for="(item,index) in approvalList" :key="index"  class="inner cu-btn round bg-blue" @click="toDetail(index)">{{ item.approvalReason }}</button>
				<button v-if="approvalList == null" class="cu-btn round bg-orange" >您没有任何的审批</button>
			</view>  
			
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				approvalList:null,
				
				flag:false
				
			}
		},
		
		onLoad() {
			
			this.loadData();
			
		},
		
		onShow() {
			
			this.loadData();
			
		},	
		
		methods: {
			
			loadData(){
				
				let id = uni.getStorageSync('userInfo').user.id;
				
				let data = {approvalUserId:id};
				
				uni.request({
					
					url:this.$serverUrl+'/event/getEventList',
					
					data:data,
					
					method:"POST",
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {
						
						console.log(rs);
						
						if(rs.data.data.length){
							
							//this.hasApproval = true
							
							this.approvalList = rs.data.data;
							
							uni.setStorageSync("approvalList",this.approvalList);
							
						}
						
					}
				})
				
			},
			
			toDetail(index){
				
				console.log("点击了！！！！")
				
				uni.redirectTo({
					url:"/pages/approvalDetail/approvalDetail?index="+index
				})
				
				
			}
			
		}
	}
</script>

<style>
.box{
		
		width: 100vw;			
		
		margin-top: 5vh;
				
		display: flex;
		
		justify-content: center;
		
		flex-wrap: wrap;
		
	}
	
	.box button{
		
		width: 60vw;
		
		height: 100upx;
		
		margin-top: 5vh;
		
	}
</style>
