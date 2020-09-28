<template>
	<view>
		<view class="cu-form-group margin-top">
			<view class="title">部门名称:</view>
			<input type="text" @focus="focus" v-model="dname" placeholder="请输入要更新的部门名称"></input>
			<button class="cu-btn bg-green" @click="query">查询</button>
		</view>
		
		<view  v-for="(item,index) in deptList" :key="index" class="cu-form-group margin-top">
			<view class="text-bold">{{ item.dname }}----{{ item.area ? item.area.aname : '没有对应大区' }}</view>
			<button class="cu-btn bg-red" @click="select(item)">选择更新</button>
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
			
			select(item){
				
				uni.setStorageSync("dept",item);
				
				uni.navigateTo({
					url:"updateDeptDetail"
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
								content:"没有该部门，请核对好部门名称再查!"
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
