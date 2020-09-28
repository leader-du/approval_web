<template>
	<view>
		<view class="cu-form-group margin-top">
			<view class="title">用户名:</view>
			<input type="text" v-model="uName" placeholder="请输入用户邮箱" @blur="checkUname"></input>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">密码:</view>
			<input type="text" v-model="password" disabled></input>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">姓名:</view>
			<input type="text" v-model="chName" placeholder="请输入中文名"></input>
		</view>
		<view  class="cu-form-group margin-top">
			<view class="title">所在部门</view>
			<picker @change="PickerChange" :value="index" :range-key="'dname'" :range="deptList">
				<view class="picker">
					{{ deptList[index].dname }}
				</view>
			</picker>
		</view>
		<view  class="cu-form-group margin-top">
			<view class="title">职位</view>
			<picker @change="jobChange" :value="idx" :range-key="'roleName'" :range="roleList">
				<view class="picker">
					{{ roleList[idx].roleName }}
				</view>
			</picker>
		</view>
		<radio-group  class="block margin-bottom" @change="RadioChange">
			
			<view class="cu-form-group margin-top">	
				<view class="title">总部人员:</view>
				<radio :class="radio != -1?'checked':''" :checked="radio == 0 ? true :false"  value="0" />
				<label class="radio" style="position: relative;left: -30upx;">否</label>
				<radio :class="radio != -1?'checked':''"  :checked="radio == 1 ? true :false" value="1" />
				<label class="radio" style="position: relative;left: -30upx;">是</label>
			</view>					
		</radio-group>
		
		<button type="primary" @click="updateUser">更新用户</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				id:null,
				
				uName:null,
				
				password:"123456",
				
				chName:null,
				
				index:0,
				
				deptId:null,
				
				deptList:null,
				
				idx:0,
				
				roleList:null,
				
				roles:[],
				
				radio:-1,
				
				status:0,
				
				user:null
			}
		},
		
		async onLoad(){
			
			await this.loadDepts(this);
			
			await this.loadRoles(this);
			
			this.user = uni.getStorageSync("user");
			
			this.id = this.user.id;
			
			this.uName = this.user.uname;
			
			this.password = this.user.password;
			
			this.chName = this.user.chName;			
			
			this.radio = this.user.status;
			
			this.setDept();
			
			this.setRole();
			
			
		},
		
		methods: {		
			
			updateUser(){
				
				let params = {
					
					"id":this.id,
					
					"uname":this.uName,
					
					"password":this.password,
					
					"chName":this.chName,
					
					"deptId":this.deptId,
					
					"roles":this.roles,
					
					"status":this.status
					
				}
				
				uni.request({
					url:this.$serverUrl + '/user/updateUser',
					
					method:"POST",
										
					data:JSON.stringify(params),
					
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
											url:"user"
										})
										
									}
								}
							})
							
						}else{
							
							uni.showModal({
								content:"更新失败,请联系管理员"
								
							})
							
						}
						
					}
				})
				
			},
			
			setRole(){
				
				this.roleList.forEach((item,index) => {
					
					if(item.roleName == this.user.roles[0].roleName){
						
						this.idx = index;
						
						return;
						
					}
					
				})
				
			},
			
			setDept(){
				
				this.deptList.forEach((item,index) => {
					
					if(item.dname == this.user.dept.dname){
						
						this.index = index;
						
						return;
						
					}
					
				})
				
			},
			
			loadRoles:(a) => {		
				
								
				return new Promise((resolve, reject) => {
					
					uni.request({
						url:a.$serverUrl + '/role/getRoleList',
						
						method:"POST",					
						
						header:{
							
							accessToken:uni.getStorageSync('userInfo').accessToken
						},
						
						success:(rs) => {	
																				
							a.roleList = rs.data.data;
							
							a.roleList.unshift({roleId:-1,roleName:"请选择职位"});
							
							resolve(rs)
							
						},
						fail() {
						
							reject("error");
							
						}
					})
					
				})
				
			},
						
			loadDepts:(a) => {
				
				return new Promise((resolve, reject) => {
					
					uni.request({
						url:a.$serverUrl + '/dept/getDeptList',
						
						method:"POST",					
						
						header:{
							
							accessToken:uni.getStorageSync('userInfo').accessToken
						},
						
						success:(rs) => {					
																				
							a.deptList = rs.data.data;
							
							a.deptList.unshift({did:-1,dname:"请选择部门"})
							
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
				
				
				this.deptId = this.deptList[this.index].did;
			},
			
			jobChange(e){
				
				this.idx = e.detail.value;	
				
			},
			
			RadioChange(e){
				
				this.radio = e.detail.value;
				
				this.status = this.radio;
				
			},
			
			checkUname(){
				
				let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
				
				if(!reg.test(this.uName)){
					
					uni.showModal({
						content:"用户名必须是盛邦工作邮箱"
					})
					
					return;
				}
				
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
			
			saveUser(){
				
				if(this.password == null || this.chName == null || this.index == 0 || this.idx == 0 || this.radio == -1){
					
					uni.showModal({
						content:"请填写所有用户信息，缺一不可"
					})
					
					return;
				}
				
				this.roles.push(this.roleList[this.idx]);
				
				let params = {
					
					"uname":this.uName,
					
					"password":this.password,
					
					"chName":this.chName,
					
					"deptId":this.deptId,
					
					"roles":this.roles,
					
					"status":this.status
					
				}			
				
				uni.request({
					url:this.$serverUrl + '/user/addUser',
					
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
										url:"manageList"
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
