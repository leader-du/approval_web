<template>
	<view class="padding">
		<view  class="cu-form-group margin-top">
			<view class="title">请选择时间段:</view>
			<picker @change="PickerChange" :value="index"  :range="times">
				<view class="picker">
					删除{{ times[index] }}天内的记录
				</view>
			</picker>
		</view>
		<button type="warn" class="margin-top" @click="deleteApproval">删除审批记录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				times:[30,45,60],
				
				days:0,
				
				index:0
				
			}
		},
		methods: {
			
			PickerChange(e){
				
				this.index = e.detail.value
				
				this.days = this.times[e.detail.value]
				
			},
			
			deleteApproval(){
				
				let _this = this;
				
				uni.showModal({
					
					content:"确定要删除该时间段记录吗?",
					
					success:(rs) => {
					
						if(rs.confirm){
							
							uni.request({
								url:_this.$serverUrl + '/record/adminDeleteRecord',
								
								method:"POST",	
												
								data:JSON.stringify({days:1}), //测试，最后要改成下面的
								
								//data:JSON.stringify({days:_this.days}),
								
								header:{
									
									accessToken:uni.getStorageSync('userInfo').accessToken
								},
								
								success:(rs) => {	
																						
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
				
			}
			
		}
	}
</script>

<style>

</style>
