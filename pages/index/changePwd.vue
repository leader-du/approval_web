<template>
	<view class="content">
		<view class="logodiv">
			<view class="logo">
				<image class="imglogo" src="../../static/logo.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="form">
			<view class="username">
				<input class="nameform" @blur="varify(newPassword)" type="text" v-model="newPassword" placeholder="请输入新密码" />
			</view>
			<view class="password">
				<input class="pawform" @blur="varify(surePassword)" type="text" v-model="surePassword" placeholder="请确认密码" />
			</view>
			<view class="margin-top margin-bottom">
				<view class="bg-orange padding radius text-center shadow-blur">
					<view class="text-sm">密码要求字母和数字组合，字母开头6-15位</view>					
				</view>
			</view>
			<view class="loginBtn" hover-class="loginBtnhover" @tap="updatePassword">
				<text class="btnvalue">修改</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newPassword:'',
				surePassword:'',
			}
		},
		methods: {
			
			varify(str){
				
				let reg = /^[a-zA-Z]\w{5,17}$/;
				
				if(!reg.test(str)){
					
					uni.showModal({
						content:"密码不符合要求，请查看下方要求格式"
					})
					
				}
				
			},
			
			updatePassword(){
				
				if(this.surePassword != this.newPassword){
					
					uni.showModal({
						
						content:"两次密码不一致,请重新输入",
						
					})
					
				}else{				
					
					
					// console.log(this.$store.state.userInfo)
					
					// let uid = this.$store.state.userInfo.uid					
					
					
					uni.request({
						
						url:this.$serverUrl+'/user/updatePassword',
						
						data:{password:this.surePassword},
						
						method:"POST",
						
						header:{
							
							accessToken:uni.getStorageSync('userInfo').accessToken
						},
						
						success(rs) {
							
							if(rs.data.code == 200){
								
								uni.showModal({
									
									content:"密码修改成功",
									
									success() {
										
										uni.navigateTo({
											url:'../applytype/applytype'
										})
										
									}
									
								})
								
								
								
							}else{
								
								uni.showModal({
									content:"服务器错误,请稍后重试"
								})
							}
							
						}
						
					})
				
					
				}
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
