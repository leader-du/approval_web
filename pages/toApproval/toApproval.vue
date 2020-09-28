<template>
	<view class="box">
		<button v-if="approvalList.length != 0" v-for="(item,index) in approvalList" :key="index" type="primary" @click="toLeaderApprovalDetail(index)">{{ item.user.dept.dname }}--{{ item.user.chName }}--{{ item.approvalReason }}</button>		
		<button v-if="approvalList.length == 0" type="warn">没有需要您审批的申请</button>
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
