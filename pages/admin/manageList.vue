<template>
	<view class="box">
		<button class="cu-btn round bg-blue" @click="userManager">用户管理</button>
				
		<button class="cu-btn round bg-blue" @click="adminManager">管理员管理</button>
		
		<button class="cu-btn round bg-blue" @click="deptManager">部门管理</button>
		
		<button class="cu-btn round bg-orange" @click="delApprovalRecord">删除审批记录</button>
	</view>   
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
			userManager(){
				
				uni.navigateTo({
					url:"user/user"
				})
				
			},
			
			adminManager(){
				
				uni.navigateTo({
					url:"admin/admin"
				})
				
			},
			
			deptManager(){
				
				uni.navigateTo({
					url:"dept/dept"
				})
				
			},
			
			delApprovalRecord(){
				
				uni.navigateTo({
					url:"approval/delApprovalRecord"
				})
				
			}
			
		}
	}
</script>

<style>
.box{
		
		width: 100vw;	
			
		/* height: 100vh;		 */
		
		margin-top: 15vh;
				
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
