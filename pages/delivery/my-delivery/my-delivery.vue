<template>
	<view class="my-delivery-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_2.png"></image>
		<view class="my-delivery-title-box">
			<view class="my-delivery-title">
				我的寄件
			</view>
			<view class="my-delivery-subtitle">
				My Delivery
			</view>
		</view>
		<view class="courier-box">
			<view>
				<view class="courier-item" :key="index" v-for="(item,index) in list" @tap="goToDeliveryDetail(item)">
					<view>
						<view class="uni-flex flex-item uni-row courier-info-box">
							<view class="courier-name flex-item">
								{{item.addressee}}
							</view>
							<view class="courier-number flex-item">
								{{item.addresseeMobileNumber}}
							</view>
							<view class="courier-icon">收</view>
						</view>
						<view class="flex-item courier-desc">{{item.addresseeAreaName + item.addresseeAddress}}</view>

						<view v-if="item.state === 'NOT_RECEIVED'" class="form-item-border"></view>
						<view v-if="item.state === 'NOT_RECEIVED'" class="calendar-icon-box uni-flex uni-row" style="margin-top: 30rpx;">
							<image class="flex-item calendar-icon" src="/static/img/icon_7.png"></image>
							<view class="flex-item calendar-icon-text">预约时间：{{item.receivingTimes}}</view>
						</view>

						<view v-if="item.payState === 'PAID' && item.state === 'RECEIVED'" class="form-item-border"></view>
						<view v-if="item.payState === 'PAID' && item.state === 'RECEIVED'" class="calendar-icon-box uni-flex uni-row" style="margin-top: 30rpx;">
							<image class="flex-item calendar-icon" src="/static/img/icon_9.png"></image>
							<view class="flex-item calendar-icon-text">快递单号：{{item.trackingNumber}}</view>
						</view>

						<view v-if="item.payState === 'PAID' && item.state === 'RECEIVED' && item.verifyState === 'VERIFIED'" class="type-box"
						 style="background-color:#999999">已寄件</view>
						<view v-if="item.payState === 'PAID' && item.state === 'RECEIVED' && item.verifyState === 'NOT_VERIFIED'" class="type-box"
						 style="background-color:#FF9F1E">已支付</view>
						<view v-if="item.state === 'NOT_RECEIVED'" class="type-box" style="background-color:#282828">待上门取件</view>
						<view v-if="item.state === 'CANCELLED'" class="type-box" style="background-color:#999999">已取消</view>
						<view v-if="item.payState === 'UNPAID' && item.state === 'RECEIVED'" class="type-box" style="background-color:#DE1111">等待支付</view>
						<view v-if="item.payState === 'PAID_FAIL'" class="type-box" style="background-color:#DE1111">支付失败</view>
					</view>
				</view>
			</view>

		</view>
		<view class="content-bg" :style="{height: bgHeight}">
			<view class="list-is-null-box" v-if="listIsNull">
				<image class="list-is-null" src="../../../static/img/ikon_2.png"></image>
				<view>暂无数据</view>
			</view>
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
				bgHeight: '0rpx',
				ifOnShow: false,
				pager: null
			};
		},
		onHide() {
			this.ifOnShow = true
		},
		onPullDownRefresh() {
			this.loadList();
		},
		onShow() {
			if (this.ifOnShow) {
				this.loadList();
			}
		},
		onLoad() {
			let vm = this;
			vm.member = vm.$store.getters.getMember;
			if (vm.member) {
				vm.loadList();
			} else {
				uni.navigateBack();
			}

		},
		onReachBottom() {
			this.loadNextList()
		},
		methods: {
			loadNextList() {
				let vm = this;
				let member = vm.$store.getters.getMember;
				if (vm.pager && vm.pager.pageCount > vm.pager.pageIndex) {
					uni.request({
						url: vm.$api.receivingRecord.memberReceivingList,
						data: {
							memberCode: member.code,
							pageIndex: vm.pager.pageIndex + 1,
							pageSize: 5
						},
						header: {},
						success: (res) => {
							if (res.data.status === 200) {
								let receivingRecords = res.data.data.receivingRecords
								vm.pager = res.data.data.pager
								for (var i = 0; i < receivingRecords.length; i++) {
									vm.list.push(receivingRecords[i])
								}
								vm.setBgHeight();
							}
						}
					})
				}
			},
			loadList() {
				let vm = this;
				let member = vm.$store.getters.getMember;
				uni.request({
					url: vm.$api.receivingRecord.memberReceivingList,
					data: {
						memberCode: member.code,
						pageSize: 5
					},
					header: {},
					success: (res) => {
						if (res.data.status === 200) {
							vm.list = res.data.data.receivingRecords
							vm.pager = res.data.data.pager
						} else {
							vm.list = []
						}

						if (vm.list.length > 0) {
							vm.listIsNull = false;
						}
						vm.setBgHeight();
					}
				})
			},
			goToDeliveryDetail(item) {
				uni.navigateTo({
					url: "/pages/delivery/delivery-detail/delivery-detail?code=" + item.code
				})
			},
			setBgHeight() {
				let vm = this;
				if (vm.list && vm.list.length) {
					vm.listIsNull = false;
					let len = vm.list.length;
					
					let minSize = 0;
					let maxSize = 0;
					
					for (var i = 0; i < vm.list.length; i++) {
						if ((vm.list[i].state === 'NOT_RECEIVED') || (vm.list[i].payState === 'PAID' && vm.list[i].state === 'RECEIVED')) {
							maxSize += 297
						} else {
							minSize += 200
						}
					}
					
					let count = 1000;
						
					if(minSize + maxSize  > count) {
						count = minSize + maxSize + 100
					}
				
					vm.bgHeight = count + 'rpx';

				} else {
					vm.listIsNull = true;
				}
			}
		},
		created() {
			let vm = this;

		}
	}
</script>

<style lang="scss">
	.my-delivery-content {
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
			height: 1000rpx;

			.my-delivery-button {
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
				margin-bottom: 10rpx;
				background-color: #FFFFFF;
				padding: 40rpx;
				width: 702rpx;
				.courier-info-box {
					display: flex;
					.courier-name {
						font-size: 32rpx;
						font-weight: bold;
						height: 45rpx;
						line-height: 45rpx;
					}

					.courier-number {
						font-size: 32rpx;
						font-weight: bold;
						height: 45rpx;
						line-height: 45rpx;
					}

					.courier-icon {
						background-color: #FF9F1E;
						color: #FFFFFF;
						width: 40rpx;
						height: 40rpx;
						margin-left: 28rpx;
						text-align: center;
					}

				}

				.calendar-icon-box {
					display: flex;
					height: 40rpx;

					.calendar-icon {
						width: 30rpx;
						height: 30rpx;
						margin-top: 6rpx;
					}

					.calendar-icon-text {
						height: 40rpx;
						line-height: 40rpx;
						font-size: 28rpx;
						color: #666666;
						margin-left: 28rpx;
					}
				}

				.form-item-border {
					/* width: 622rpx; */
					height: 2rpx;
					background-color: #EAEAEA;
					margin-top: 40rpx;
				}

				.courier-desc {
					height: 40rpx;
					line-height: 40rpx;
					font-size: 28rpx;
					color: #999999;
					margin-top: 10rpx;
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

		.my-delivery-title-box {
			position: absolute;
			top: 100rpx;
			left: 24rpx;
			text-align: left;
			color: #FFFFFF;

			.my-delivery-title {
				font-size: 46rpx;
				margin-bottom: 10rpx;
			}

			.my-delivery-subtitle {
				font-size: 36rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>
