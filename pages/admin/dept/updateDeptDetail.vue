<template>
	<view class="padding-xs">
		<view class="cu-form-group margin-top">
			<view class="title">部门名称:</view>
			<input type="text"  v-model="dname" ></input>
			
		</view>
		<view  class="cu-form-group margin-top">
			<view class="title">所在区域</view>
			<picker @change="PickerChange" :value="index" :range-key="'aname'" :range="areaList">
				<view class="picker">
					{{ areaList[index].aname }}
				</view>
			</picker>
		</view>
		<button type="primary" class="margin-top" @click="updateDept">更新</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index:0,
				areaList:null,
				dname:null,
				did:null
			}
		},
		
		async onLoad() {
			
			await this.loadArea(this);
			
			let dept = uni.getStorageSync("dept");
			
			this.dname = dept.dname;
			
			this.did = dept.did;
			
			this.setArea(dept.dareaId);
			
		},
		
		methods: {
			
			setArea(id){
				
				this.areaList.forEach((item,index) => {
					
					if(item.aid == id){
						
						console.log(index);
						
						this.index = index;
						
					}
					
				})
				
			},
			
			loadArea(obj){
				
				return new Promise((resolve,reject) => {
					
					uni.request({
						url:obj.$serverUrl + '/area/getAreaList',
						
						method:"POST",
						
						header:{
							
							accessToken:uni.getStorageSync('userInfo').accessToken
						},
						
						success:(rs) => {
							
							obj.areaList = rs.data.data;
							
							obj.areaList.unshift({aid:-1,aname:"---请选择所属区域---"})
							
							resolve(rs);
							
						},
						
						fail() {
							
							reject("error");
						}
					})
					
				})
				
			},
			
			PickerChange(e){
				
				this.index = e.detail.value;
				
			},
			
			updateDept(){
				
				// console.log(this.areaList[this.index].aid)
				
				let param = {
					did:this.did,
					dname:this.dname,
					dareaId:this.areaList[this.index].aid
				}
			
				uni.request({
					url:this.$serverUrl + '/dept/updateDept',
					
					method:"POST",
					
					data:JSON.stringify(param),
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {
						
						if(rs.data.code == 200){
							
							uni.showModal({
								content:"更新成功!",
								
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
