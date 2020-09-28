<template>
	<view class="box">
		
		<view class="cu-form-group margin-top">
			<view class="title">申请人:</view>
			<view class="">{{ approvalData.chName }}</view>
		</view>
							
		<view class="cu-form-group margin-top">
			<view class="title">审批事由:</view>
			<view class="">{{ approvalData.approvalReason }}</view>
		</view>
		
		<view class="cu-form-group margin-top">
			<view class="title">审批金额:</view>
			<view>{{ approvalData.approvalMoney }}</view>
		</view>
		<view class="cu-form-group  margin-top">
			<view class="title">备注</view>
			<view>{{ approvalData.approvalRemark }}</view>
		</view>
		
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				审批凭证
			</view>					
		</view>
		<view v-if="approvalData != null" class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in approvalData.notes" :key="index" @click="ViewImage" :data-url="item.approvalNoteUrl">
				 <image :src="item.approvalNoteUrl | addUrl" mode="aspectFill" @click="tapImg(index)"></image>
					
				</view>
				
			</view>
		</view>
		<!-- <view class="cu-form-group margin-top">
			<view class="title">审批人:</view>
			
			<view class="cu-tag  bg-orange view-lg" v-for="(item,index) in approvalData.users" :key = "index">{{item.chName}}</view>				
							
			
		</view>	 -->	
		<view class="padding flex flex-direction row justify-between margin-top">
			<button class="cu-btn bg-brown lg" @click="toApprovalProgress">查看审批进度</button>
		</view>
		<view class="cu-form-group align-start margin-top">
			<view class="title">审批意见:</view>
			<textarea maxlength="-1" v-model="approval_user_remark"   placeholder="请输入审批相关备注信息"></textarea>
		</view>					
		
		<view class="padding flex  justify-between">
			<button class="cu-btn bg-red lg" @click="approval(0)">拒绝</button>
			<button class="cu-btn bg-green lg" @click="approval(1)">同意</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				index:0,
				approvalData:null,
				approval_user_remark:null,
				imgUrls:null  ,//审批图片路径列表  需带上服务器路径
				
			}
		},
		
		onLoad(e) {			
			
			
			this.index = e.index
			
			this.approvalData = uni.getStorageSync("requiredApproval")[this.index]
			
			//console.log(uni.getStorageSync("approvalList")[this.index])
			
			this.imgUrls = this.approvalData.notes.map((val,index) => {
				
				return this.$addUrl+val.approvalNoteUrl;
				
			})
			
		},
		
		methods: {
			
			toApprovalProgress(){
				
				uni.navigateTo({
					url:"../approvalProgress/approvalProgress?id="+this.approvalData.approvalEventId
				})
				
			},
			
			approval(index){
				
				if(index == 0 && !this.approval_user_remark){
					
					uni.showModal({
						content:"必须给出拒绝的理由"
					})
					
				}else{
				
					let param = {
						
						"eventId":this.approvalData.approvalEventId,
						
						"approvalUserRemark":this.approval_user_remark,
						
						"status":index,
						
						"approvalLeaderId":uni.getStorageSync("userInfo").user.id
						
					}
					
					uni.request({
						
						url:this.$serverUrl + '/record/addRecord',
						
						data:JSON.stringify(param),
						
						method:"POST",
						
						header:{							
							accessToken:uni.getStorageSync('userInfo').accessToken
						},
						
						success(rs) {
							
							console.log(rs);
							
							if(rs.data.code == 200){
								
								uni.showModal({
									content:"审批完成!",
									
									success(rs) {
										
										if(rs.confirm){
											
											uni.redirectTo({
												url:"../toApproval/toApproval"
											})
											
										}
										
									}
								})
								
							}
							
						}
					})
				}
			},
			
			updateMyApproval(index){
				
				uni.redirectTo({
					url:"../updateApproval/updateApproval?index="+this.index
				})
				
			},
			
			tapImg(index){
				
				uni.previewImage({
					urls:this.imgUrls,
					current:index
				})
				
			}
		}
	}
</script>

<style>
.box .cu-form-group{	
	
	justify-content: flex-start;
	
	-webkit-justify-content: flex-start;

	
}
</style>
