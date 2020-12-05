<template>
	<view class="box">
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">报销事由:</view>
				<input type="text" v-model="approval_reason" placeholder="请输入本次报销事由" name="input"></input>
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
				<view class="title">报销金额:</view>
				<input type="digit" v-model="approval_money" placeholder="请输入本次报销金额" name="input"></input>
			</view>
			<view class="cu-form-group align-start margin-top">
				<view class="title">报销备注:</view>
				<textarea maxlength="-1" v-model="approval_remark"   placeholder="请输入报销相关备注信息"></textarea>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">文件上传:</view>
				<button type="primary" @click="fileUpload">上传</button>
			</view>
			<view v-for="(file,index) in fileArr" :key='index' class="cu-form-group margin-top">
				<text>{{ file.filename }}</text>
				<button class="cu-btn round bg-orange" @click="delFile(index)">删除</button>
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					报销凭证上传
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
			<view class="cu-list menu margin-top" v-if="isShow" >
				<view class="bg-orange padding radius text-left shadow-blur">
					<view class="text-sm">请确保前两个分别是出纳，财务，其他审批人按照职级依次搜索</view>					
				</view>
			</view>
			<view class="cu-list menu margin-top" v-if="approval_leaders.length != 0" >
				<view class="cu-item" v-for="(leader,index) in approval_leaders" :key='index'>
					<view class="content">						
						<text class="text-grey" @click="addLeader(leader)">{{ leader.chName }}--{{ leader.dept.dname }}</text>
					</view>
				</view>
			</view>
			<view class="action bg-white margin-top">
				<view class="cu-tag  bg-orange text-lg" v-for="(item,index) in leaderList" :key = "index">{{item.chName}}</view>				
			
				<view v-if="leaderList.length"  class="cu-tag  bg-gradual-red text-lg" @click="clear">重置</view>
			</view>
			
			<!-- <view class="margin-top margin-bottom">
				<view class="bg-gradual-orange padding radius text-left shadow-blur">
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
				isShow:false, //搜索审批人空的情况处理
				fileArr:[] ,//上传文件存储对象
				fileReturnArr:[] // 上传成功后返回数据存储的数组 用于存储到数据库中
			}
		},
		onLoad(e) {
			
			this.approval_type_id = e.type_id;
			
			let id = uni.getStorageSync('userInfo').user.roles[0].roleId;
					
			this.isAreaManager = id == 7 ? true : false
			
			this.isBaseManager = id == 6 ? true : false
			
			//陈文斌的曹妃甸是秦授权的一个部门，报销需要王俊杰审批
			
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
			
			// 删除上传文件
			
			delFile(n){
				
				let _this = this;
				
				uni.showModal({
					content:"确定要删除吗?",
					
					success(res) {
						
						if(res.confirm){
							
							_this.fileArr.splice(n,1);
							
							_this.fileReturnArr.splice(n,1);
						}
						
					}
				})
				
			},
			
			fileUpload(){
				let _this = this;
				wx.chooseMessageFile({
					count: 5,     //能选择文件的数量
					  type: 'file',   //能选择文件的类型,我这里只允许上传文件.还有视频,图片,或者都可以
					  success(res) { 
						
						res.tempFiles.forEach((file,index) => {
							
							var size = file.size;
								var filename = file.name;
								var newfilename = filename + "";  
								
								console.log(res)
								
								console.log(size)
								
								console.log(filename)
								
							if (size > 10485760|| !_this.fileReg(newfilename)){ //我还限制了文件的大小和具体文件类型
								  wx.showToast({
									title: '文件大小不能超过10MB,格式必须为pdf/word/excel！',
									icon: "none",
									duration: 2000,
									mask: true
								  })
								}else{						  
								  
								  _this.fileArr.push({
									  
									  path:file.path,
									  
									  filename:filename
									  
								  });
								  
								  uni.uploadFile({
								  	
								  	url:_this.$serverUrl + '/file/uploadFile',	
								  	
								  	filePath:file.path,
								  	
								  	name:'file',
								  	
								  	header:{
								  		"Content-Type": "multipart/form-data",
								  		accessToken:uni.getStorageSync('userInfo').accessToken
								  		},
								  	
								  	success(rs){								
								  		
								  		console.log(rs);
								  		// 组合上传文件存储到数据库的数据
								  		
										_this.fileReturnArr.push({
											
											approvalFileUrl:JSON.parse(rs.data).data.approvalFileUrl
											
										})
										
								  	},
								  	
								  	fail(msg) {
								  		
								  		console.log(msg)
								  	}
								  })
								  
								}
							
						})
						
					  }
				})
				
			},
			
			fileReg(filename){
				
				let flag = false;
				
				if(filename.indexOf('.pdf') != -1){
					
					flag = true;
					
				}
				
				if(filename.indexOf('.doc') != -1){
					
					flag = true;
					
				}
				
				if(filename.indexOf('.docx') != -1){
					
					flag = true;
					
				}
				
				if(filename.indexOf('.xls') != -1){
					
					return true;
					
				}
				
				if(filename.indexOf('.xlsx') != -1){
					
					flag = true;
					
				}
				
				return flag;
				
			},
			
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
				
				let user = uni.getStorageSync('userInfo').user;
				
				if(user.deptId == 38){
					
					this.selectCount = 3;
					
					this.preApprovalId = user.id;
				} 
				
				this.seachParam = {
					
					chName:this.leaderName,
										
					selectCount:this.selectCount					
					
				}		
				 
				
				if(this.selectCount > 2){
					
					this.seachParam.preApprovalId = this.preApprovalId				
					
				}
				
				console.log(this.seachParam)
				
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
					
					let status = uni.getStorageSync('userInfo').user.status;
					
					// 判断金额是否超过限额，需要黄总审批 
					//总部人员报销不管多少钱都找黄总审批 非总部 超过2000到黄总 老的需求
											
					//新的需求所有报销借款最后都由黄总审批
					
					if(!this.isContainHz()){					
							
						uni.showModal({
							content:"最后必须由董事长审批"
						})
						
						return;
						
						
					}
					// else{
					
					// 	if(this.approval_money >= 2000 && !this.isContainHz()){
							
					// 		uni.showModal({
					// 			content:"非总部人员报销超过2000，必须董事长审批"
					// 		})
							
					// 		return;
					// 	}
						
					// }
					
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
							
					// 组合文件上传数据
					
					if(this.fileArr.length != 0){
						
						// 组合文件上传数据
						
						let _this = this;
						
						this.fileReturnArr.forEach((item,index) => {
							
							item.approvalFileName = _this.fileArr[index].filename;
							
						})
						
						this.applyData.approvalFileList = this.fileReturnArr
						
					}					
					
					
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
				
			}
			
			
		}
	}
</script>

<style>
.cu-form-group{
	
	justify-content: start!important;
	
}

.cu-btn{
	
	margin-left: 30upx;
}
		
</style>
