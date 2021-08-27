<template>
	<view class="my-courier-content">
		<image mode="scaleToFill" class="head-img" src="../../../static/img/bg_2.png"></image>
		<view class="my-courier-title-box">
			<view class="my-courier-title">
				我的快递
			</view>
			<view class="my-courier-subtitle">
				My Courier
			</view>
		</view>
		<view class="courier-box">
			<view>
				<view class="courier-item" :key="index" v-for="(item,index) in list" @tap="goToCourierDetail(item)">

					<view v-if="item.state === 'WAIT'">
						<view class="uni-flex flex-item uni-row courier-info-box" >
							<view class="courier-name flex-item">
								{{item.businessName}}
							</view>
							<view class="courier-number flex-item">
								{{item.trackingNumber}}
							</view>
						</view>
						<view class="flex-item courier-desc">派件方式：{{item.deliveryMethodName}}</view>
						<view class="flex-item courier-desc" style="margin-bottom: 40rpx;">派件时间：{{item.deliveryTimes}}</view>
						<view class="type-box" style="background-color: #282828;">已到站</view>
					</view>

					<view v-if="item.state === 'DELIVERING'">
						<view class="uni-flex flex-item uni-row courier-info-box">
							<view class="courier-name flex-item">
								{{item.businessName}}
							</view>
							<view class="courier-number flex-item">
								{{item.trackingNumber}}
							</view>
						</view>
						<view class="flex-item courier-desc">派件方式：{{item.deliveryMethodName}}</view>
						<view class="flex-item courier-desc" style="margin-bottom: 40rpx;">派件时间：{{item.deliveryTimes}}</view>
						<view class="flex-item courier-waiter" @click.stop="phoneCall(item)">派送信息：{{item.deliveryman + ' ' + item.deliverymanMobileNumber}}</view>
						<view class="type-box" style="background-color: #FF9F1E;">派送中</view>
					</view>

					<view v-if="item.state === 'SIGNED'">
						<view class="uni-flex flex-item uni-row courier-info-box">
							<view class="courier-name flex-item">
								{{item.businessName}}
							</view>
							<view class="courier-number flex-item">
								{{item.trackingNumber}}
							</view>
						</view>
						<view class="flex-item courier-desc" style="margin-bottom: 40rpx;">签收时间：{{item.signedTime}}</view>
						<view class="type-box" style="background-color: #999999;">已签收</view>
					</view>

					<view v-if="item.state === 'WAIT_SIGNED'">
						<view class="uni-flex flex-item uni-row courier-info-box">
							<view class="courier-name flex-item">
								{{item.businessName}}
							</view>
							<view class="courier-number flex-item">
								{{item.trackingNumber}}
							</view>
						</view>
						<view class="flex-item courier-desc" style="margin-bottom: 40rpx;">到站时间：{{item.createTime}}</view>
						<view class="type-box" style="background-color: #FF9F1E;">待取件</view>
					</view>

					<view v-if="item.state === 'REFUSE'">
						<view class="uni-flex flex-item uni-row courier-info-box">
							<view class="courier-name flex-item">
								{{item.businessName}}
							</view>
							<view class="courier-number flex-item">
								{{item.trackingNumber}}
							</view>
						</view>
						<view class="flex-item courier-desc" style="margin-bottom: 40rpx;">拒收时间：{{item.signedTime}}</view>
						<view class="type-box" style="background-color: #DE1111;">已拒收</view>
					</view>
					
					<view v-if="item.state === 'EXCEPTION'">
						<view class="uni-flex flex-item uni-row courier-info-box">
							<view class="courier-name flex-item">
								{{item.businessName}}
							</view>
							<view class="courier-number flex-item">
								{{item.trackingNumber}}
							</view>
						</view>
						<view class="flex-item courier-desc">派件方式：{{item.deliveryMethodName}}</view>
						<view @click.stop="phoneCall(item)" class="flex-item courier-desc" style="margin-bottom: 40rpx;">派送信息：{{item.deliveryman + ' ' + item.deliverymanMobileNumber}}</view>
						<view class="flex-item courier-error">异常原因：{{item.exceptionDesc}}</view>
						<view class="type-box" style="background-color: #DE1111;">派送异常</view>
					</view>

				</view>
			</view>

		</view>
		<view class="content-bg">
			<view class="list-is-null-box" v-if="listIsNull">
				<image class="list-is-null" src="../../../static/img/ikon_2.png"></image>
				<view>暂无数据</view>
			</view>

			<button :style="{marginTop: buttonTopMargin,marginBottom: buttonBottomMargin,marginLeft: '24rpx',marginRight: '24rpx'}"
			 class="my-courier-button" type="warn" @tap="goToRefuseRecord">预先拒收拦截</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				buttonTopMargin: '0rpx',
				buttonBottomMargin: '0rpx',
				listIsNull: false,
				ifOnShow: false
			};
		},
		onPullDownRefresh() {
			this.loadList();
		},
		onReachBottom() {
			this.loadNextList()
		},
		onHide() {
			this.ifOnShow = true
		},
		onShow() {
			if (this.ifOnShow) {
				this.loadList();
			}
		},
		onLoad() {
			let vm = this;
			vm.member = vm.$store.getters.getMember;
			if (!vm.member) {
				uni.navigateBack();
			} else {
				vm.loadList();
			}
			vm.setMyCourierButtonTopMargin();
		},
		methods: {
			
			phoneCall(item) {
				uni.makePhoneCall({
				    phoneNumber: item.deliverymanMobileNumber
				});
			},
			loadNextList() {
				let vm = this;
				let member = vm.$store.getters.getMember;
				
				if (vm.pager && vm.pager.pageCount > vm.pager.pageIndex) {
					uni.request({
						url: vm.$api.deliveryRecord.memberDeliveryList,
						data: {
							memberCode: member.code,
							pageIndex: vm.pager.pageIndex + 1,
							pageSize: 6
						},
						header: {},
						success: (res) => {

							if (res.data.status === 200) {
								let deliveryRecords = res.data.data.deliveryRecords
								vm.pager = res.data.data.pager
								for (var i = 0; i < deliveryRecords.length; i++) {
									vm.list.push(deliveryRecords[i])
								}
								vm.setMyCourierButtonTopMargin();
							}
						}
					})
				}
			},
			goToRefuseRecord() {
				let vm = this;
				uni.navigateTo({
					url: "/pages/delivery/refuse-record/refuse-record"
				})
			},
			loadList() {
				let vm = this;
				uni.request({
					url: vm.$api.deliveryRecord.memberDeliveryList,
					data: {
						pageSize:6,
						memberCode: vm.member.code
					},
					header: {},
					success: (res) => {
						vm.list = res.data.data.deliveryRecords
						vm.pager = res.data.data.pager
						if (vm.list && vm.list.length > 0) {
							vm.listIsNull = false
						}
						vm.setMyCourierButtonTopMargin();
					}
				})
			},
			goToCourierDetail(item) {
				uni.navigateTo({
					url: "/pages/delivery/courier-detail/courier-detail?code=" + item.code
				})
			},
			setMyCourierButtonTopMargin() {
				let vm = this;
				// 默认Margin
				let signedSize = 210 + 10;
				let deliveringSize = 260 + 96 + 10;
				let waitSize = 260 + 10;
				let excepionSize = 210 + 96 + 10;
				let refuseSize = 210 + 10;
				let waitSignedSize = 210 + 10;
				// 统计总数
				let signedCount = 0;
				let deliveringCount = 0;
				let waitCount = 0;
				let excepionCount = 0;
				let refuseCount = 0;
				let waitSignedCount = 0;

				if (vm.list) {
					for (var i = 0; i < vm.list.length; i++) {
						if (vm.list[i].state === 'SIGNED') {
							signedCount += 1;
						} else if (vm.list[i].state === 'DELIVERING') {
							deliveringCount += 1;
						} else if (vm.list[i].state === 'WAIT') {
							waitCount += 1;
						} else if (vm.list[i].state === 'EXCEPTION') {
							excepionCount += 1;
						} else if (vm.list[i].state === 'REFUSE') {
							refuseCount += 1;
						} else if (vm.list[i].state === 'WAIT_SIGNED') {
							waitSignedCount += 1;
						}
					}
				}

				let total = waitSignedCount * waitSignedSize + signedCount * signedSize + deliveringCount * deliveringSize +
					waitCount * waitSize + excepionCount * excepionSize + refuseCount * refuseSize;
				vm.buttonTopMargin = total + 'rpx';
				if (total === 0) {
					vm.listIsNull = true;
					vm.buttonBottomMargin = 500 + 'rpx'
				} else if (total > 660) {
					vm.buttonBottomMargin = '168rpx'
				} else {

					vm.buttonBottomMargin = (900 - total) + 'rpx'
				}
			}
		},
		created() {
			let vm = this;

		}
	}
</script>

<style lang="scss">
	.my-courier-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #282828;


		.building-select-box {
			height: 518rpx;
			width: 100%;
		}

		.color999 {
			color: #999999;
		}

		.color28 {
			color: #282828;
		}

		.colorDE1111 {
			color: #DE1111;
		}

		.content-bg {
			background-color: #EDF1F5;
			width: 100%;

			.my-courier-button {
				// margin: 1300rpx 24rpx 168rpx 24rpx;
				background-color: #DE1111;
				font-size: 36rpx;
				border-radius: 6px;
				width: 702rpx;
				height: 98rpx;
			}

			.list-is-null-box {
				margin-top: 100rpx;
				margin-bottom: 100rpx;
				text-align: center;
				font-size: 28rpx;
				color: #666666;

				.list-is-null {
					width: 210rpx;
					height: 176rpx;
					margin-bottom: 40rpx;
				}
			}
		}

		.head-img {
			width: 750rpx;
			height: 460rpx;
		}

		.courier-box {
			display: flex;
			position: absolute;
			top: 320rpx;
			width: 702rpx;

			.courier-item {
				display: flex;
				width: 702rpx;
				margin-bottom: 10rpx;
				background-color: #FFFFFF;

				.courier-info-box {
					width: 702rpx;
					height: 130rpx;
					display: flex;

					.courier-name {
						width: 144rpx;
						font-size: 36rpx;
						font-weight: bold;
						margin: 40rpx 28rpx 40rpx 40rpx;
						height: 50rpx;
						line-height: 50rpx;
					}

					.courier-number {
						width: 300rpx;
						font-size: 28rpx;
						color: #999999;
						height: 40rpx;
						line-height: 40rpx;
						margin: 50rpx 0 40rpx 0;
					}
				}

				.courier-desc {
					height: 40rpx;
					line-height: 40rpx;
					font-size: 28rpx;
					color: #666666;
					margin-left: 40rpx;
					margin-bottom: 10rpx;
				}

				.courier-waiter {
					height: 40rpx;
					line-height: 40rpx;
					padding: 28rpx 0rpx 28rpx 40rpx;
					background-color: #FFF9EF;
					color: #E88500;
					font-size: 28rpx;
				}

				.courier-error {
					height: 40rpx;
					line-height: 40rpx;
					padding: 28rpx 0rpx 28rpx 40rpx;
					background-color: #FFEFEF;
					color: #DE1111;
					font-size: 28rpx;
				}

				position: relative;

				.type-box {
					position: absolute;
					width: 140rpx;
					height: 56rpx;
					right: 0;
					top: 0;
					font-size: 24rpx;
					line-height: 56rpx;
					text-align: center;
					color: #FFFFFF;
				}
			}


		}

		.my-courier-title-box {
			position: absolute;
			top: 100rpx;
			left: 24rpx;
			text-align: left;
			color: #FFFFFF;

			.my-courier-title {
				font-size: 46rpx;
				margin-bottom: 10rpx;
			}

			.my-courier-subtitle {
				font-size: 36rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>
