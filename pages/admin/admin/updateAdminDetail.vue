<template>
	<view class="padding-xs">
		<view class="cu-form-group margin-top">
			<view class="title">管理员:</view>
			<input type="text" v-model="user.uname" @blur="isExist" placeholder="请输入管理员用户名" ></input>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">密码:</view>
			<input type="text" @focus="focus" v-model="user.password"></input>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">姓名:</view>
			<input type="text" v-model="user.chName" placeholder="请输入中文名"></input>
		</view>	
		
		<button type="primary" @click="updateAdmin">更新管理员</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				user:null,
				oldPwd:null
				
			}
		},
		
		onLoad(){
			
			this.user = uni.getStorageSync("userAdmin");
			
			this.oldPwd = this.user.password;
			
			
			
		},
		
		methods: {
			
			focus(){
				
				if(this.user.password == this.oldPwd){
				
					uni.showModal({
						content:"确定要修改密码吗?",
						
						success:(rs) => {
							
							if(rs.confirm){
								
								this.user.password = "";
							}
							
						}
					})
				
				}
				
			},
			
			isExist(){
					
				let data = {"uname":this.uname}
				
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

			updateAdmin(){
				
				if(this.user.uname == null || this.user.password == null || this.user.chName == null ){
					
					uni.showModal({
						
						content:"请填写所有用户信息，缺一不可"
						
					})
					
					return;
				}
						
				
				uni.request({
					url:this.$serverUrl + '/user/updateAdmin',
					
					method:"POST",	
									
					data:JSON.stringify(this.user),
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {					
						
						
						console.log(rs);
						
						if(rs.data.data){
							
							uni.showModal({
								
								content:"更新成功",
								
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
