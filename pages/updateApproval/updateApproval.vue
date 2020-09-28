<template>
	<view class="box">
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">报销事由:</view>
				<input type="digit" v-model="approval_reason" placeholder="请输入本次报销事由" name="input"></input>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">报销金额:</view>
				<input type="digit" v-model="approval_money" placeholder="请输入本次报销金额" name="input"></input>
			</view>
			<view class="cu-form-group align-start margin-top">
				<view class="title">报销备注:</view>
				<textarea maxlength="-1" v-model="approval_remark"   placeholder="请输入报销相关备注信息"></textarea>
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
						<view class="cu-tag bg-red" @click.stop="DelImg(index,$event)" :data-index="index">
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
						<text class="text-grey" @click="addLeader(leader)">{{ leader.chName }}--{{ leader.deptName }}</text>
					</view>
				</view>
			</view>
			<view class="action bg-white margin-top">
				<view class="cu-tag  bg-orange text-lg" v-for="(item,index) in leaderList" :key = "index">{{item.chName}}</view>				
			
				<view v-if="leaderList.length"  class="cu-tag  bg-gradual-red text-lg" @click="clear">重置</view>
			</view>
			
			<view class="margin-top margin-bottom">
				<view class="bg-gradual-orange padding radius text-left shadow-blur">
					<view class="text-sm">请按照审批人职级依次填写(从低到高,前两个必须是出纳，会计)，每次一个审批人</view>					
				</view>
			</view>
			<button type="primary" @click="updateApply">更新申请</button>
			
		</form>
	</view>
</template>

<script>
	
	
	
	export default {
		data() {
			return {
				index:0,
				version:0,
				approval_event_id:null,
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
				imgUrls:[],
				noteList:[] ,//审批凭证列表
				isFirstSearch:true //判断是否是第一次搜索审批人
			}
		},
		onLoad(e) {
			
			//this.approval_type_id = e.type_id		
			
			this.index = e.index;
			
			let approvalData = uni.getStorageSync("approvalList")[this.index]
			
			this.approval_event_id = approvalData.approvalEventId;
			
			this.approval_reason = approvalData.approvalReason;
			
			this.approval_money = approvalData.approvalMoney;
			
			this.approval_remark = approvalData.approvalRemark;
			
			this.approval_type_id = approvalData.approvalTypeId;
			
			this.version = approvalData.version;
			
			this.imgs = approvalData.notes.map((val,index) => {
				
				return val.approvalNoteUrl;
				
			})
			
			this.imgList =  approvalData.notes.map((val,index) => {
				
				return this.$addUrl+val.approvalNoteUrl;
				
			})
			
			// 获取审批凭证列表
			
			this.noteList = approvalData.notes
			
			this.leaderList = approvalData.users;
			
		},
				
		components:{},
		methods: {		
			
			
			ChooseImage() {
				
				let _this = this
				
				uni.chooseImage({
					//count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					//sourceType: ['album'], //从相册选择  默认二者都有
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
									
									//console.log(JSON.parse(rs.data).data.approvalNoteUrl);
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
			DelImg(index,event) {
				
				console.log(index);
				uni.showModal({
					title: '亲爱的同事',
					content: '确定要删除该凭证吗',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							
							this.imgList.splice(event.currentTarget.dataset.index, 1);
							
							this.imgs.splice(event.currentTarget.dataset.index, 1);
							
							let data = {approvalNoteId:this.noteList[index].approvalNoteId};
							
							uni.request({
								url:this.$serverUrl+'/note/delImg',
								
								data:JSON.stringify(data),
								
								header:{
									
									accessToken:uni.getStorageSync('userInfo').accessToken
								},
								
								method:"POST",
								
								success(rs) {
									
									console.log(rs);
									
									if(rs.data.code == 200){
										
										uni.showModal({
											content:"删除成功!"
										})
									}
									
								}
							})
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
				
				//要更新审批人，必须先清空
				if(this.isFirstSearch){
					
					uni.showModal({
						content:"确定要重置审批人吗?",
						
						success:rs => {
							
							if(rs.confirm){
								
								this.isFirstSearch = false;
								
								this.selectCount = 1;
										
								this.leaderList = [];
								
								this.seachParam = {};
								
							}
							
						}
					})
					
				}else{
					
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
							
							//console.log(rs)
							
							this.approval_leaders = rs.data.data
							
							//console.log(this.approval_leaders)
							
						}
						
					})
					
				}
				
				
				
			},
			
			addLeader(item){
				
				let flag = false;
				
				//清空搜索框搜索关键字
				  
				this.leaderName = "";
				
				console.log(item)
				
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
						
					}else{
						
						//让selectCount不再走后台出纳和会计的逻辑
						
						if(this.selectCount == 2) this.selectCount = 3
						
						// 记录本次审批人id
						this.preApprovalId = item.id
						
					}
					
					
					
					this.leaderList.push(item);
					
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
			
			updateApply(){
				
				if(!this.leaderList.length){
					
					uni.showModal({
						
						content:"审批人不能为空"
					})
					
				}else{
					
					// 获取是否是总部人员
					
					let status = uni.getStorageSync('userInfo').user.status;
					
					// 判断金额是否超过限额，需要黄总审批 
					//总部人员报销不管多少钱都找黄总审批 非总部 超过2000到黄总						
					
					if(status == 1 && !this.isContainHz()){					
							
						uni.showModal({
							content:"总部人员报销,必须找黄总审批"
						})
						
						return;
						
						
					}else{
					
						if(this.approval_money >= 2000 && !this.isContainHz()){
							
							uni.showModal({
								content:"非总部人员报销超过2000，必须由黄总审批"
							})
							
							return;
						}
						
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
						
						"approvalEventId":this.approval_event_id,
						
						"approvalReason":this.approval_reason,
						
						'approvalTypeId':this.approval_type_id,
						
						'approvalMoney':this.approval_money,
						
						'approvalRemark':this.approval_remark,
						
						'approvalUserId':uni.getStorageSync('userInfo').user.id,
						
						'approvalPersons':this.approval_persons,
							
						"version":this.version,
							
						'notes':imgs
						
						
					}
					
					console.log(this.applyData)
					
					uni.request({
						url:this.$serverUrl + '/event/updateApproval',
						
						data:JSON.stringify(this.applyData),
						
						method:"POST",
						
						header:{							
							accessToken:uni.getStorageSync('userInfo').accessToken
						},
						
						success(rs) {
							
							if(rs.statusCode == 200){
								
								uni.showModal({
									
									content:"更新成功",
									
									success(rs) {
									
										if(rs.confirm){
											
											uni.redirectTo({
												url:"../applytype/applytype"											
											})
											
										}
										
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
		
</style>
