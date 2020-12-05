<template>
	<view class="box">
		<button class="cu-btn round bg-blue" v-if="approvalList.length != 0" v-for="(item,index) in approvalList" :key="index"  @click="toLeaderApprovalDetail(index)">{{ item.user.dept.dname }}--{{ item.user.chName }}--{{ item.approvalReason }}</button>		
		<button class="cu-btn round bg-orange" v-if="approvalList.length == 0" >没有需要您审批的申请</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				approvalList:[],
				
				flag:false
				
			}
		},
		onLoad() {
			
			this.loadData();
			
		},
		methods: {
			
			loadData(){
				
				let id = uni.getStorageSync('userInfo').user.id;
				
				uni.request({
					
					url:this.$serverUrl + '/event/getUserApprovalList',
					
					data:JSON.stringify({id:id}),
					
					method:"POST",
					
					header:{							
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {
						
						console.log(rs);
						
						if(rs.data.data.length != 0){							
							
							this.approvalList = rs.data.data;
							
							if(this.approvalList.length){
								
								uni.setStorageSync("requiredApproval",this.approvalList);
								
								this.flag = true
							}
						}else{			
							
							
							this.approvalList = [];
						}					
						
						
						// console.log(this.approvalList.length)   
						
						
					}
				})
				
			},
			
			toLeaderApprovalDetail(index){
				
				uni.navigateTo({
					url:"../leaderApprovalDetail/leaderApprovalDetail?index="+index
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
		
		width: 90vw;
		
		height: 100upx;
		
		margin-top: 5vh;
		
	}
</style>
