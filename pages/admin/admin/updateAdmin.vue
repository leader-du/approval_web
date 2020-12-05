<template>
	<view class="padding-xs">
		
		<view class="text-center margin-top-xs">选择需要更新的管理员</view>
		<view  v-for="(item,index) in adminList" :key="index" class="cu-form-group margin-top">
			<view class="text-bold">{{ item.chName }}</view>
			<button class="cu-btn bg-red" @click="update(item)">更新</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				adminList:null
			}
		},
		
		onLoad() {
			
			this.loadAdmin();
			
		},
		
		methods: {
			
			update(obj){
				
				uni.setStorageSync("userAdmin",obj);
				
				uni.navigateTo({
					url:"updateAdminDetail"
				})
				
			},
			
			loadAdmin(){
				
				uni.request({
					
					url:this.$serverUrl + '/user/getAdminList',
					
					method:"POST",	
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {					
						
						
						this.adminList = rs.data.data;
						
					}
				})
				
			}
			
		}
	}
</script>

<style>

</style>
