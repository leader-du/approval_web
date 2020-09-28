<template>
	<view class="padding">
		<view class="cu-form-group margin-top">
			<view class="title">部门名称:</view>
			<input type="text"  v-model="dname" placeholder="请输入要添加的部门名称"></input>
			
		</view>
		<view  class="cu-form-group margin-top">
			<view class="title">所在区域</view>
			<picker @change="PickerChange" :value="index" :range-key="'aname'" :range="areaList">
				<view class="picker">
					{{ areaList[index].aname }}
				</view>
			</picker>
		</view>
		<button class="margin-top" type="primary" @click="addDept">添加</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index:0,
				areaList:null,
				dname:null
			}
		},
		
		onLoad() {
			
			this.loadArea();
		},
		
		methods: {
			
			loadArea(){
				
				uni.request({
					url:this.$serverUrl + '/area/getAreaList',
					
					method:"POST",
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {
						
						this.areaList = rs.data.data;
						
						this.areaList.unshift({aid:-1,aname:"---请选择所属区域---"})
						
					}
				})
				
			},
			
			PickerChange(e){
				
				this.index = e.detail.value;
				
			},
			
			addDept(){
				
				// console.log(this.areaList[this.index].aid)
				
				let param = {
					dname:this.dname,
					dareaId:this.areaList[this.index].aid
				}
			
				uni.request({
					url:this.$serverUrl + '/dept/addDept',
					
					method:"POST",
					
					data:JSON.stringify(param),
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {
						
						if(rs.data.code == 200){
							
							uni.showModal({
								content:"添加成功!",
								
								success(rs) {
									if(rs.confirm){
										
										uni.navigateTo({
											url:"dept"
										})
										
									}
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
