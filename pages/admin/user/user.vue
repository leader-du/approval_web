<template>
	<view class="box">
		<button class="cu-btn round bg-blue margin-top" @click="addUser">添加用户</button>
		
		<button class="cu-btn round bg-blue margin-top" @click="updateUser">更新用户</button>
		
		<button class="cu-btn round bg-red" @click="delUser">删除用户</button>
		
		
	</view>   
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
			addUser(){
				
				uni.navigateTo({
					url:"addUser"
				})
				
			},
			
			delUser(){
				
				uni.navigateTo({
					url:"delUser"
				})
				
			},
			
			updateUser(){
				
				uni.navigateTo({
					url:"updateUser"
				})
			}
			
			
			
		}
	}
</script>

<style>
.box{
		
		width: 100vw;			
		
		margin-top: 12vh;
				
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
