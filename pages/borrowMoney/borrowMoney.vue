<template>
	<view class="box">
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">借款事由:</view>
				<input type="text" v-model="approval_reason" placeholder="请输入本次借款事由" name="input"></input>
			</view>
			<view v-if="isAreaManager" class="cu-form-group margin-top">
				<view class="title">复核总经理</view>
				<picker @change="PickerChange" :value="index" :range-key="'chName'" :range="baseManagerList">
					<view class="picker">
						{{ baseManagerList[index].chName }}
					</view>
				</picker>
			</view>
			
			
			<radio-group v-if="isBaseManager && baseFuManager" class="block" @change="RadioChange">
				
				<view class="cu-form-group margin-top">	
					<view class="title">复核副总</view>
					<radio :class="radio != -1?'checked':''"   :value="baseFuManager.chName" />
					<label class="radio" style="position: relative;left: 10upx;">{{ baseFuManager.chName }}</label>
					
				</view>					
			</radio-group>
			
			<view class="cu-form-group margin-top">
				<view class="title">借款金额:</view>
				<input type="digit" v-model="approval_money" placeholder="请输入本次借款金额" name="input"></input>
			</view>
			<view class="cu-form-group align-start margin-top">
				<view class="title">借款备注:</view>
				<textarea maxlength="-1" v-model="approval_remark"   placeholder="请输入借款相关备注信息"></textarea>
			</view>
			
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					借款凭证上传
				</view>
				<view class="action">
					{{imgList.length}}/9
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @click="ViewImage" :data-url="imgList[index]">
					 <image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @click.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @click="ChooseImage" v-if="imgList.length<9">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">审批人:</view>
				<input type="text" v-model="leaderName" placeholder="请输入审批人姓名" name="input" @input="searchLeader"></input>
			</view>			
			<view class="cu-list menu margin-top" v-if="approval_leaders.length != 0" >
				<view class="cu-item" v-for="(leader,index) in approval_leaders" :key='index'>
					<view class="content">						
						<text class="text-grey" @click="addLeader(leader)">{{ leader.chName }}--{{ leader.dept.dname }}</text>
					</view>
				</view>
			</view>
			<view class="cu-list menu margin-top" v-if="isShow" >
				<view class="bg-orange padding radius text-left shadow-blur">
					<view class="text-sm">请确保前两个分别是出纳，财务，其他审批人按照职级依次搜索</view>					
				</view>
			</view>
			<view class="action bg-white margin-top">
				<view class="cu-tag  bg-orange text-lg" v-for="(item,index) in leaderList" :key = "index">{{item.chName}}</view>				
				
				<view v-if="leaderList.length"  class="cu-tag  bg-gradual-red text-lg" @click="clear">重置</view>
			</view>
			
			<!-- <view class="margin-top margin-bottom">
				<view class="bg-red padding radius text-left shadow-blur">
					<view class="text-sm">请按照审批人职级依次填写(从低到高,前两个必须是出纳，会计)，每次一个审批人</view>					
				</view>
			</view> -->
			<button type="primary" @click="submitApply">提交申请</button>
			
		</form>
			
		
	</view>
</template>

<script>
	
export default {
		data() {
			return {
				approval_reason:null,
				approval_type_id:null,
				approval_user_id:null,
				approval_money:null,
				now_approval_id:null,
				imgList: [],
				approval_remark:"",			
				leaderName:null,
				leader:null,	
				leaderList:[],
				approval_leaders:[],
				approval_persons:null,
				applyData:null,
				imgs:[],
				seachParam:null,
				selectCount:1 ,//记录第几次选择审批人
				preApprovalId:null,
				isAreaManager:false,//判断是否是基地总经理
				isBaseManager:false, //判断是否是基地总经理
				baseManagerList:[] ,//区域包含总经理列表
				baseFuManager:null, //基地副总
				index:0  ,//总经理选择初始value
				radio:-1 ,//单选样式
				isSTFlag:false ,// 是否石唐区域
				isShow:false //搜索审批人空的情况处理
			}
		},
		onLoad(e) {
			
			this.approval_type_id = e.type_id;
			
			let id = uni.getStorageSync('userInfo').user.roles[0].roleId;
					
			this.isAreaManager = id == 7 ? true : false
			
			this.isBaseManager = id == 6 ? true : false
			
			//陈文斌的曹妃甸是秦授权的一个部门，借款需要王俊杰审批
			
			if(uni.getStorageSync('userInfo').user.id == 311){
				
				uni.request({
					url:this.$serverUrl + '/user/getUserByUid',
					
					method:"POST",
					
					data:JSON.stringify({id:64}),//64王俊杰的id
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {
							
						
						//添加到审批人列表
						this.leaderList[0] = {"chName":"预审出纳"}
						
						this.leaderList[1] = {"chName":"预审会计"}
						
						this.leaderList[2] = rs.data;
						
						console.log(rs);	
						
					}
				})
				
			}
			
			//通过用户查出负责基地的副总
			
			if(id == 6){
				
				// 如果是石唐区域 那么副总都是郝国森 
				
				this.isSTArea().then(rs => {
					
					this.isSTFlag = rs;
					
					// console.log(this.isSTFlag)
						
					if(this.isSTFlag){
						
						//通过郝国森的uid查询该用户
						
						uni.request({
							url:this.$serverUrl + '/user/getUserByUid',
							
							method:"POST",
							
							data:JSON.stringify({id:261}),//261郝国森的id
							
							header:{
								
								accessToken:uni.getStorageSync('userInfo').accessToken
							},
							
							success:(rs) => {
								
								console.log(rs);				
									
									
								if(rs.data){
									
									this.baseFuManager = rs.data;
								}
								
								
								
							}
						})
						
					}else{
						// 非石唐区域正常查询
						uni.request({
							url:this.$serverUrl + '/user/getFuManager',
							
							method:"POST",
							
							data:JSON.stringify({id:uni.getStorageSync('userInfo').user.id}),
							
							header:{
								
								accessToken:uni.getStorageSync('userInfo').accessToken
							},
							
							success:(rs) => {
								
								//console.log(rs);				
									
									
								if(rs.data){
									
									this.baseFuManager = rs.data;
								}
								
								
								
							}
						})
					}
					
				})
				
			}
			
			// 通过用户查出所有管辖基地的总经理
			
			if(id == 7){
				uni.request({
					url:this.$serverUrl + '/user/getBaseManager',
					
					method:"POST",
					
					data:JSON.stringify({id:uni.getStorageSync('userInfo').user.id}),
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:(rs) => {
						rs.data.forEach((val,index) => {
							
								
							if(!this.isContainObj(this.baseManagerList,val)){
								
								 this.baseManagerList.push(val)
								
							}
							
						})
						
						//console.log(this.baseManagerList)
						
						this.baseManagerList.unshift({"id":-1,"chName":"--请选择--"});
						
						
					}
				})
			
			}
			
		},
				
		components:{},
		methods: {		
			
			// 判断是否属于石唐区域
			
			async isSTArea(){
				
				let rs = await this.getData();
				
				return rs.aid == 5 ? true : false;
				
				
				
			},
			
			getData(){
				
				return new Promise( resole => {
					
					uni.request({
						url:this.$serverUrl + '/area/getAreaByUid',
						
						method:"POST",
						
						data:JSON.stringify({id:uni.getStorageSync('userInfo').user.id}),
						
						header:{
							
							accessToken:uni.getStorageSync('userInfo').accessToken
						},
						
						success:(rs) => {
							
							
							resole(rs.data);
							
							
						}
					})
					
				})
				
			},
			
			//判断数组是否包含某个对象
			
			isContainObj(arr,item){
					
				if(JSON.stringify(arr).indexOf(JSON.stringify(item)) == -1){
					
					return false;
				}
				
				return true;
				
			},
			
			// 选择副总
			
			RadioChange(e) {
				this.radio = e.detail.value
				//添加到审批人列表
				this.leaderList[0] = {"chName":"预审出纳"}
				
				this.leaderList[1] = {"chName":"预审会计"}
				
				this.leaderList[2] = this.baseFuManager
			},
			
			//选择总经理
			
			PickerChange(e) {
				
				//console.log("总经理id===="+e.detail.value)
				
				this.index = e.detail.value
				
				if(this.index != 0){
					
					this.leaderList[0] = {"chName":"预审出纳"}
					
					this.leaderList[1] = {"chName":"预审会计"}
					
					this.leaderList[2] = this.baseManagerList[this.index]
					
				}
				
			},
			
			ChooseImage() {
				
				let _this = this
				
				uni.chooseImage({
					//count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择  默认二者都有
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
						
												
						this.imgList.forEach(function(val,index){
							
							// console.log(val+'==='+index);
							
							uni.uploadFile({
								
								url:_this.$serverUrl + '/note/uploadImg',	
								
								filePath:_this.imgList[index],
								
								name:'file',
								
								header:{
									"Content-Type": "multipart/form-data",
									accessToken:uni.getStorageSync('userInfo').accessToken
									},
								
								success(rs){								
									
									
									_this.imgs.push(JSON.parse(rs.data).data.approvalNoteUrl)
									
								},
								
								fail(msg) {
									console.log(msg)
								}
							})
							
						})
						
						
						
					}
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '亲爱的同事',
					content: '确定要删除该凭证吗',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			
			// 审批人
			
			searchLeader(){			
				
				this.seachParam = {
					
					chName:this.leaderName,
										
					selectCount:this.selectCount					
					
				}
				
				if(this.selectCount > 2){
					
					this.seachParam.preApprovalId = this.preApprovalId				
					
				}
				
				uni.request({
					url:this.$serverUrl+'/user/getApprovalList',
					
					data:JSON.stringify(this.seachParam),
					
					method:'POST',
					
					header:{
						
						accessToken:uni.getStorageSync('userInfo').accessToken
					},
					
					success:rs => {	
						
						
						
						if(rs.data.data.length){
							
							this.approval_leaders = rs.data.data
							
							this.isShow = false;
							
						}else{
							
							this.isShow = true;
						}
						
					
						
					}
					
				})
				
				
				
				
			},
			
			addLeader(item){
				
				let flag = false;
				
				//清空搜索框搜索关键字
				  
				this.leaderName = "";
				
				//console.log(item)
				
				this.leaderList.forEach((val,index) => {
					
					if(val.id == item.id){
						
						flag = true
						
						uni.showModal({
							content:"添加过该审批人"
						})
						
					}
					
				})
				
				if(!flag){
					
					// 记录出纳和会计
					
					if(this.selectCount < 2){
						
						this.selectCount++;
						
						// 总经理复核逻辑添加
						this.leaderList[0] = item;
						
					}else{
						
						//让selectCount不再走后台出纳和会计的逻辑
						
						if(this.selectCount == 2) {
							
							this.selectCount = 3
							
							// 总经理复核逻辑添加
							this.leaderList[1] = item;
							
						}else{
							
							this.leaderList.push(item);
						}						
						
						// 记录本次审批人id
						this.preApprovalId = item.id
						
					}				
				
					
					
					
				}			
				
				
			},
			
			clear(){
				
				let _this = this
				
				this.selectCount = 1
				
				uni.showModal({
					
					content:"确定要重置审批人吗?",
					
					success() {
						
							_this.leaderList = [];
							
							_this.seachParam = {}
						
					}
				})			
				
			},
			
			submitApply(){
				
				if(!this.leaderList.length){
					
					uni.showModal({
						
						content:"审批人不能为空"
					})
					
				}else{
					
					// 获取是否是总部人员
					
					let user = uni.getStorageSync('userInfo').user;
					
					let status = user.status;
					
					// 判断金额是否超过限额，需要黄总审批 
					//总部人员借款超过500找黄总审批 非总部 超过2000到黄总						
					
					if(status == 1 && !this.isBusinessEmployee(user.deptId) && this.approval_money >= 500 && !this.isContainHz()){					
							
						uni.showModal({
							content:"借款金额超过500需黄总审批"
						})
						
						return;
						
						
					}else if(this.isBusinessEmployee(user.deptId) && this.approval_money >= 500 && !this.isContainDz()){
						
						uni.showModal({
							
							content:"借款金额超过500需董总审批",
							
						})
						
						return;
						
					}else if(this.approval_money >= 2000 && !this.isContainHz()){
							
							uni.showModal({
								content:"借款金额超过2000需黄总审批"
							})
							
							return;
							
					}
						
					
					
					// 把审批人数组所有ID存到arr里传给后台
					let arr = [];
					
					this.leaderList.forEach((val,index) => {
						
							arr.push(val.id)
						
						})
						
					this.approval_persons = arr.join(',');				
					
					// 处理图片路径数组  approvalNoteUrl
					
					let imgs = [];
					
					this.imgs.forEach((val,index) => {
						
						imgs[index] = {
							
							approvalNoteUrl:val
						}
						
					})
					
					console.log(imgs);
					
					this.applyData = {
						
						"approvalReason":this.approval_reason,
						
						'approvalTypeId':this.approval_type_id,
						
						'approvalMoney':this.approval_money,
						
						'approvalRemark':this.approval_remark,
						
						'approvalUserId':uni.getStorageSync('userInfo').user.id,
						
						'approvalPersons':this.approval_persons,	
							
						'notes':imgs
						
						
					}
					
					console.log(this.applyData)
					
					uni.request({
						url:this.$serverUrl + '/event/addApproval',
						
						data:JSON.stringify(this.applyData),
						
						method:"POST",
						
						header:{							
							accessToken:uni.getStorageSync('userInfo').accessToken
						},
						
						success(rs) {
							
							if(rs.statusCode == 200){
								
								uni.showModal({
									content:"添加成功",
									
									success() {
									
										uni.navigateTo({
											url:"../applytype/applytype"											
										})
										
									}
								})
								
							}
							
						}
					})
				
				}
				
				
				
			},
			
			// 查看审批人是否包含黄总
			
			isContainHz(){
				
				let rs = false;
				
				this.leaderList.forEach((val,index) => {
					
					//console.log(val.status)
					
					if(val.status == 2){
						
						rs = true
						
					}
					
				})
				
				return rs;
				
			},
			
			//判断是否是事业部的员工
			
			isBusinessEmployee(id){
				
				let arr = [3,4,5,6];
				
				if(arr.indexOf(id) == -1) return false
				
				else return true;
				
			},
			
			//判断审批人中是否有董总
			
			isContainDz(){
				
				let rs = false;
				
								
				this.leaderList.forEach((val,index) => {
					
					//console.log(val.status)
					
					if(val.chName == "董大治"){
						
						rs = true
						
					}
					
				})
				
				return rs;
				
			}
		}
	}
</script>

<style>
.cu-form-group{
	
	justify-content: start!important;
	
}
		
</style>
