<template>
	<view class="box">
		<view v-if="event" class="text-center margin-bottom bg-blue white padding">{{ event.user.dept.dname }}--{{ event.user.chName }}--{{ event.approvalReason }}</view>
		<evan-steps>
			<evan-step v-for="(item,index) in event.users" :key="index"  :title="item.chName"  :description="event.records[index].approvalLeaderId == item.id?event.records[index].approvalUserRemark:'待审批'"
			:status="event.approvalStatus[index]"></evan-step>
			
		</evan-steps>
		
	</view>
</template>

<script>
	import EvanSteps from '@/components/evan-steps/evan-steps.vue'
	import EvanStep from '@/components/evan-steps/evan-step.vue'
	import UniIcons from '@/components/uni-icons/uni-icons.vue'
	
	export default {
		components: {
			EvanSteps,
			EvanStep,
			UniIcons
		},
		data() {
			return {
				event:null,
				id:null,
				chName:""
			}
		},
		
		
		onLoad(e) {
			
			this.id = e.id;
			
			this.chName = uni.getStorageSync('userInfo').user.chName;
			
			uni.request({
				
				url:this.$serverUrl + '/record/getRecords',
				
				data:JSON.stringify({approvalEventId:this.id}),
				
				method:"POST",
				
				header:{							
					accessToken:uni.getStorageSync('userInfo').accessToken
				},
				
				success:(rs) => {
					
					console.log(rs);
															
					this.event = rs.data.data;
					
					this.event.approvalStatus = [];
					
					this.event.users.forEach((item,index) => {
						
						let  status = null;
						
						if(this.event.records[index]){
							
							status = this.event.records[index].status
							
							if(status == 1 || status == 0){
								
								if(status == 1){
									
									this.event.approvalStatus.push('finish');
									
								}else{
									
									this.event.approvalStatus.push('error');
								}
							}
							
						}else{
							
							this.event.approvalStatus.push('wait');
							
							
						}
						
						
						
						
						
					})
					
				}
				
			})
		},
		methods: {
			
			
			
		}
	}
</script>

<style>
	.box{
		
		width: 100vw;
		
		height: 100vh;
		
		padding: 50rpx;
		
		box-sizing: border-box;
		
		background-color: #fff;
	}
</style>
