<template>
	<view class="box">
		
				
		<button class="cu-btn round bg-blue" @click="addAdmin">添加管理员</button>
		
		
		
		<button class="cu-btn round bg-red" @click="delAdmin">删除管理员</button>
		
		
	</view>   
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
			
			
			addAdmin(){
				
				uni.navigateTo({
					
					url:"addAdmin"
				})
				
			},
			
			delAdmin(){
				
				uni.navigateTo({
					
					url:"delAdmin"
				})
				
			}
			
			
		}
	}
</script>

<style>
.box{
		
		width: 100vw;			
		
		margin-top: 20vh;
				
		display: flex;
		
		justify-content: center;
		
		flex-wrap: wrap;
		
	}
	
	.box button{
		
		width: 60vw;
		
		height: 100upx;
		
		margin-top: 10vh;
		
	}
</style>
