<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	

	
	.logodiv{
		width: 100vw;
		height: 30vh;
		display: flex;
		justify-content: center;
		align-items:flex-end;
	}
	.logo{
		width: 400upx;
		/* height: 200upx; */
		overflow: hidden;
	}
	.logo .imglogo{
		width: 100%;
	}
	.form{
		padding: 0 100upx;
		margin-top: 80upx;
		font-size: 30upx;
	}
	.username{
		width: 100%;
		height: 100upx;
		background: white;
		border-radius: 20upx;
		box-sizing: border-box;
		padding: 0 20upx;
		margin-top: 25upx;		
	}
	.username .nameform{
		width: 100%;
		height: 100%;
		text-align: center;
		
	}
	.password{
		width: 100%;
		height: 100upx;
		background: white;
		border-radius: 20upx;
		box-sizing: border-box;
		padding: 0 20upx;
		margin-top: 25upx;		
	}
	.password .pawform{
		width: 100%;
		height: 100%;
		text-align: center;
		
	}
	.loginBtn{
		width: 100%;
		height: 100upx;
		background: #007cb1;
		border-radius: 50upx;
		margin-top: 50upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loginBtn .btnvalue{
		color: white;
	}
	.registBtn{
		text-align: center;
		color: #007cb1;
		font-size: 25upx;
		margin-top: 20upx;
	}
	.loginBtnhover{
		background: #3e3e5d;
	}
	
		
	.box{
		
		padding: 10upx;
	}
	
	.action view{
		
		margin: 20upx 0;
	}
	
	/*每个页面公共css */
</style>
