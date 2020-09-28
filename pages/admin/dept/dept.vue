<template>
	<view class="box">
		
		
		<button class="cu-btn round bg-blue" @click="addDept">添加部门</button>
		
		<button class="cu-btn round bg-blue" @click="updateDept">更新部门</button>
		
		<button class="cu-btn round bg-red" @click="delDept">删除部门</button>
		
		
	</view>   
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
			
			
			addDept(){
				
				uni.navigateTo({
					url:"addDept"
				})
				
			},
			
			updateDept(){
				
				uni.navigateTo({
					url:"updateDept"
				})
				
			},
			
			delDept(){
				
				uni.navigateTo({
					url:"delDept"
				})
				
			}
			
			
			
		}
	}
</script>

<style>
.box{
		
		width: 100vw;	
			
		/* height: 100vh;		 */
		
		margin-top: 13vh;
				
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
