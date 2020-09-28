<template>
	<view class="box">
		<button class="margin-top" type="primary" @click="toMyApproval">我申请的审批</button>
		<button v-if="isShow" type="primary" @click="toApproval">需要处理的审批</button>
		<button v-if="isFinance" type="primary" @click="toCompletedApproval">查看已完成的审批</button>
		<button type="primary" @click="applyRefund">报销审批</button>
		<button type="primary" @click="borrowMoney">借款审批</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				isShow:false,
				isFinance:false
			}
		},
		
		onLoad(){
			
			// 一个用户可能有多个角色
			
			let roles = uni.getStorageSync('userInfo').user.roles;
			
			let deptId = uni.getStorageSync('userInfo').user.deptId;
			
			if(deptId == 38){
				
				this.isFinance = true;
			}
			
			roles.forEach((val,index) => {
				// 判断是否有审批权限
				if(val.roleGrade != 3){
					
					this.isShow =  true
					
					return;
				}
				
			})
			
			
			
			
			
			
			//查询个人审批详情
			
			
			
			//查询需要我审批的申请
			
			//let id = uni.getStorageSync('userInfo').user.id;
			
			
			
		},
		
		onShow(e) {
			
			//this.approvalEventId = e.detail.eventId
			
		},
		
		methods: {
			
			toCompletedApproval(){
				
				uni.navigateTo({
					url:"../completedApproval/completedApproval"
				})
				
			},
			
			//查看需要我审批的申请
			toApproval(){
				
				uni.navigateTo({
					url:"../toApproval/toApproval"
				})
				
			},
			
			toMyApproval(){
				
				
				uni.navigateTo({
					url:'../myApproval/myApproval'
				})
				
			},
			
			applyRefund(){
				
				uni.navigateTo({
					url:'../applyRefund/applyRefund?type_id=1'
				})
				
			},
			
			borrowMoney(){
				
				uni.navigateTo({
					url:'../borrowMoney/borrowMoney?type_id=2'
				})
				
			}
			
		}
	}
</script>

<style>
	.box{
		
		width: 100vw;	
			
		height: 100vh;
		
		/* padding-top: 30vh; */
		
		display: flex;
		
		justify-content: center;
		
		flex-wrap: wrap;
		
	}
	
	.box button{
		
		width: 60vw;
		
		height: 100upx;
		
		/* margin: 5upx; */
		
		/* align-items:space-between; */
		
	}
</style>
