<template>
	<view class="content">
		<view class="logodiv">
			<view class="logo">
				<image class="imglogo" src="../../static/logo.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="form">
			<view class="username">
				<input class="nameform" type="text" v-model="uname" placeholder="请输入用户名" />
			</view>
			<view class="password">
				<input class="pawform" type="password" v-model="password" placeholder="请输入密码" />
			</view>
			<view class="loginBtn" hover-class="loginBtnhover" @tap="loginrequest">
				<text class="btnvalue">登录</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	
	import { mapMutations } from "vuex";
	
	import { mapState } from "vuex";
	
	export default {
		data() {
			return {
				uname:'',
				password:'',
			}
		},
		
		computed:{
			
			...mapState(['userInfo'])
			
		},
		
		methods: {
			
			...mapMutations(['login']),
			
			loginrequest(){
				
				let _this = this
				
				let data = {
					
					"username":this.uname,  
					
					"password":this.password
					
				}
				
				uni.request({
					url:_this.$serverUrl+'/user/login',
					
					data:data,
					
					header:{
						
						"Content-Type":"application/json"  
						
					},
					
					method:'POST',  
					
					success(rs) {
						
						console.log(rs);
						
						if(rs.data.code == 200){
							
							_this.login(rs.data.data);
							
							let user = rs.data.data.user;
							
							uni.setStorageSync('userInfo',rs.data.data)
							
							
							if(_this.password == '123456'){
								
								uni.navigateTo({
									url:'./changePwd'
								})
								
							}else if(user.status == 4){
								
								uni.navigateTo({
									url:"../admin/manageList"
								})
								
							}else{
								
								uni.navigateTo({
									url:'../applytype/applytype'
								})
								
							}
							
						}else{
							
							uni.showModal({
								content:rs.data.message
							})
							
							
						}
						
						
						
					}
				})
				
				// uni.navigateTo({
				// 	url:'./changePwd'
				// })
		
			}
		}
	}
</script>

<style>
	
	.content {
		/* background: #3F536E; */
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		
	}
	
</style>
