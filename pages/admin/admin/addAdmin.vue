<template>
	<view class="padding-xs">
		<view class="cu-form-group margin-top">
			<view class="title">管理员:</view>
			<input type="text" v-model="uName" @blur="isExist" placeholder="请输入管理员用户名" ></input>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">密码:</view>
			<input type="text" v-model="password" disabled></input>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">姓名:</view>
			<input type="text" v-model="chName" placeholder="请输入中文名"></input>
		</view>	
		
		<button type="primary" @click="saveAdmin">添加管理员</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				uName:null,
				
				password:"123456",
				
				chName:null				
				
			}
		},
		
		
		
		methods: {
			
			isExist(){
					
				let data = {"uname":this.uName}
				
				uni.request({
					url:this.$serverUrl + '/user/checkUserIsExist',
					
					method:"POST",	
									
					data:JSON.stringify(data),
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {			
						
																			
						if(rs.data.data){
							
							uni.showModal({
								
								content:"用户名已经存在，请更换!"
								
							})
							
						}
						
					}
				})
				
				
			},

			saveAdmin(){
				
				if(this.uName == null || this.password == null || this.chName == null ){
					
					uni.showModal({
						
						content:"请填写所有用户信息，缺一不可",
						
					})
					
					return;
				}
				
				
				
				let params = {
					
					"uname":this.uName,
					
					"password":this.password,
					
					"chName":this.chName
					
				}			
				
				uni.request({
					url:this.$serverUrl + '/user/addAdmin',
					
					method:"POST",	
									
					data:JSON.stringify(params),
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {					
						
						
						console.log(rs);
						
						if(rs.data.data){
							
							uni.showModal({
								
								content:"添加成功",
								
								success() {
									
									uni.navigateTo({
										url:"admin"
									})
								}
							})
							
						}
						
					}
				})
				
			}
			
		}
	}
</script>

<style>

</style>
