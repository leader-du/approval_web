<template>
	<view class="padding-xs">
		
		<view class="text-center margin-top-xs bg-orange padding">删除管理员</view>
		<view  v-for="(item,index) in adminList" :key="index" class="cu-form-group margin-top">
			<view class="text-bold">{{ item.chName }}</view>
			<button class="cu-btn bg-red" @click="deleteAdmin(item.id)">删除</button>
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
			
			deleteAdmin(id){
				
				let _this = this;
				
				uni.showModal({
					
					content:"确定要删除吗?",
					
					success(rs) {
						
						if(rs.confirm){
							
							uni.request({
								
								url:_this.$serverUrl + '/user/deleteAdmin',
								
								method:"POST",	
								
								data:JSON.stringify({id:id}),
								
								header:{
									
									accessToken:uni.getStorageSync('userInfo').accessToken
								},
								
								success:(rs) => {					
									
									if(rs.data.code == 200){
										
										uni.showModal({
											content:"删除成功"								
											
										})
										
									}
									
									_this.adminList.forEach((item,index) => {
										
										if(item.id == id){
											
											_this.adminList.splice(index,1);
											
											return false;
											
										}
										
									})
									
								}
							})
							
						}
						
					}
					
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
