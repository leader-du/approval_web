<template>
	<view>
		<view class="cu-form-group margin-top">
			<view class="title">姓名:</view>
			<input type="text" @focus="focus"  v-model="chName" placeholder="请输入要更新的用户姓名"></input>
			<button class="cu-btn bg-green" @click="query">查询</button>
		</view>
		<view  v-for="(item,index) in userList" :key="index" class="cu-form-group margin-top">
			<view class="text-bold">{{ item.chName }}------{{ item.dept.dname }}</view>
			<button class="cu-btn bg-red" @click="select(item)">选择</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chName:null,
				userList:null
			}
		},
		methods: {
			
			focus(){
				
				this.chName = "";
				
				this.userList = null;
				
			},
			
			select(item){
				
				uni.setStorageSync("user",item);
				
				uni.navigateTo({
					url:"updateUserDetail"
				})
				
			},
			
			query(){
			
				uni.request({
					url:this.$serverUrl + '/user/getUserByChname',
					
					method:"POST",
					
					data:{chName:this.chName},
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {
						
						console.log(rs);
						
						if(rs.data.data.length > 0){
							
							this.userList = rs.data.data
						}else{
							
							uni.showModal({
								content:"查无此人，请核对好姓名再查!"
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
