<template>
	<view>
		<view class="cu-form-group margin-top">
			<view class="title">部门:</view>
			<input type="text" @focus="focus" v-model="dname" placeholder="请输入要删除的部门名称"></input>
			<button class="cu-btn bg-green" @click="query">查询</button>
		</view>
		
		<view  v-for="(item,index) in deptList" :key="index" class="cu-form-group margin-top">
			<view class="text-bold">{{ item.dname }}</view>
			<button class="cu-btn bg-red" @click="delUser(item.did)">删除</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				dname:null,
				
				deptList:null
				
			}
		},
		methods: {
			
			focus(){
				
				this.dname = "";
				
				this.deptList = null;
				
			},
			
			delUser(id){
				
				let _this = this;
				
				uni.request({
					url:this.$serverUrl + '/dept/delDeptById',
					
					method:"POST",
					
					data:JSON.stringify({did:id}),
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {				
											
						console.log(rs);
						
						if(rs.data.data){
							
							uni.showModal({
								
								content:"删除部门成功!",
															
								success:(rs) => {
									
									if(rs.confirm){
										
										_this.deptList.forEach((val,index) => {
											
											if(val.did = id){
												
												_this.deptList.splice(index,1);
												
												return;
												
											}
											
										})
										
									}
									
								}
								
							})
							
						}
						
						
						
					}
				})
				
			},
			query(){
				
				uni.request({
					url:this.$serverUrl + '/dept/getDeptListByDname',
					
					method:"POST",
					
					data:{dname:this.dname},
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {
						
						console.log(rs);
						
						if(rs.data.data.length > 0){
							
							this.deptList = rs.data.data
							
						}else{
							
							uni.showModal({
								content:"不存在该部门，请核对好再查!"
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
