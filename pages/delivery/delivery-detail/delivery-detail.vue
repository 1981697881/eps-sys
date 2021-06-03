<template>
	<view class="send-delivery-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_6.png"></image>
		<view class="send-delivery-title-box">
			<view class="send-delivery-title">
				快递详情
			</view>
			<view class="send-delivery-subtitle">
				Courier Detail
			</view>
		</view>
		<view class="courier-box">
			<view>
				<view class="courier-item ">
					<view>
						<view class="uni-flex flex-item uni-row courier-info-box">
							<view class="courier-name flex-item uni-row">
								<view class="flex-item">{{receivingRecord.sender}}</view>
								<view class="flex-item" style="margin-left: 28rpx;">{{receivingRecord.senderMobileNumber}}</view>
							</view>
						</view>
						<view class="flex-item courier-desc hide-text" style="margin-bottom: 40rpx;">
							{{receivingRecord.senderAreaName + receivingRecord.senderAddress}}
						</view>
					</view>

					<view class="icon_11">寄</view>
					<view class="flex-item form-item-border"></view>
					<view>
						<view class="uni-flex flex-item uni-row courier-info-box" style="margin-top: 40rpx;">
							<view class="courier-name flex-item uni-row">
								<view class="flex-item">{{receivingRecord.addressee}}</view>
								<view class="flex-item" style="margin-left: 28rpx;">{{receivingRecord.addresseeMobileNumber}}</view>
							</view>
						</view>
						<view class="flex-item courier-desc hide-text">
							{{receivingRecord.addresseeAreaName + receivingRecord.addresseeAddress}}
						</view>
					</view>
					<view class="icon_12">收</view>
				</view>

				<view class="info-box">
					<image mode="scaleToFill" class="state-head-img" src="/static/img/bg_10.png"></image>
					<view class="state-desc">{{getStateName()}}</view>
				</view>


				<view class="form-box" v-if="receivingRecord.state === 'NOT_RECEIVED'">
					<view style="width: 100%;">
						<view class="uni-flex uni-row" style="display: flex;" v-if="(receivingRecord.waiter != null) && (receivingRecord.waiterMobileNumber != null)" @click.stop="phoneCall">
							<view class="flex-item form-item-label">
								揽件员
							</view>
							<view class="flex-item form-item-value">
								{{receivingRecord.waiter + ' ' + receivingRecord.waiterMobileNumber}}
							</view>
						</view>
						<view class="form-item-border" style="margin-top: 40rpx;margin-bottom: 51rpx;" v-if="(receivingRecord.waiter != null) && (receivingRecord.waiterMobileNumber != null)"></view>
						<view class="uni-flex uni-row" style="display: flex;">
							<view class="flex-item form-item-label">
								预约时间
							</view>
							<view class="flex-item form-item-value">
								{{receivingRecord.receivingTimes}}
							</view>
						</view>
						<view class="form-item-border" style="margin-top: 40rpx;margin-bottom: 51rpx;"></view>
					</view>
				</view>

				<view class="form-box" v-if="receivingRecord.state === 'CANCELLED'">
					<view style="width: 100%;">
						<view class="uni-flex uni-row" style="display: flex;" v-if="(receivingRecord.waiter != null) && (receivingRecord.waiterMobileNumber != null)" @click.stop="phoneCall">
							<view class="flex-item form-item-label">
								揽件员
							</view>
							<view class="flex-item form-item-value">
								{{receivingRecord.waiter + ' ' + receivingRecord.waiterMobileNumber}}
							</view>
						</view>
						<view class="form-item-border" style="margin-top: 40rpx;margin-bottom: 51rpx;" v-if="(receivingRecord.waiter != null) && (receivingRecord.waiterMobileNumber != null)"></view>
						<view class="uni-flex uni-row" style="display: flex;">
							<view class="flex-item form-item-label">
								取消时间
							</view>
							<view class="flex-item form-item-value">
								{{receivingRecord.updateTime | dateFormat('yyyy-MM-dd HH:mm:ss')}}
							</view>
						</view>
						<view class="form-item-border" style="margin-top: 40rpx;margin-bottom: 51rpx;"></view>
					</view>
				</view>

				<view class="form-box" v-if="receivingRecord.state === 'RECEIVED'">
					<view style="width: 100%;">
						<view class="uni-flex uni-row" style="display: flex;" v-if="(receivingRecord.waiter != null) && (receivingRecord.waiterMobileNumber != null)" @click.stop="phoneCall">
							<view class="flex-item form-item-label">
								揽件员
							</view>
							<view class="flex-item form-item-value">
								{{receivingRecord.waiter + ' ' + receivingRecord.waiterMobileNumber}}
							</view>
						</view>
						<view class="form-item-border" style="margin-top: 40rpx;margin-bottom: 51rpx;" v-if="(receivingRecord.waiter != null) && (receivingRecord.waiterMobileNumber != null)"></view>
						<view class="uni-flex uni-row" style="display: flex;">
							<view class="flex-item form-item-label">
								寄件费用
							</view>
							<view class="flex-item form-item-value">
								{{receivingRecord.budget}}元
							</view>
						</view>
						<view class="form-item-border" style="margin-top: 40rpx;margin-bottom: 51rpx;"></view>
						<view class="uni-flex uni-row" style="display: flex;">
							<view class="flex-item form-item-label" style="width: 150rpx;">
								优惠券抵扣
							</view>
							<view class="flex-item form-item-value">
								{{getDeduction()}}
							</view>
						</view>
						<view class="form-item-border" style="margin-top: 40rpx;margin-bottom: 51rpx;"></view>
						<view class="uni-flex uni-row" style="display: flex;">
							<view class="flex-item form-item-label" style="width: 200rpx;">
								寄件费用合计
							</view>
							<view class="flex-item form-item-value" style="color: #DE1111;">
								{{receivingRecord.amount}}元
							</view>
						</view>
						<view class="form-item-border" style="margin-top: 40rpx;margin-bottom: 51rpx;"></view>
						<view class="uni-flex uni-row" style="display: flex;">
							<view class="flex-item form-item-label">
								运单号
							</view>
							<view class="flex-item form-item-value">
								{{receivingRecord.trackingNumber}}
							</view>
						</view>
						<view class="form-item-border" style="margin-top: 40rpx;"></view>
					</view>
				</view>

			</view>

		</view>


		<view class="content-bg" v-if="receivingRecord.state === 'NOT_RECEIVED'">
			<button @click="onCancel" class="order-button" type="warn">取消寄件</button>
		</view>

		<view v-if="receivingRecord.state === 'CANCELLED' || (receivingRecord.payState === 'PAID' && receivingRecord.state === 'RECEIVED')" class="content-bg" style="height: 1200rpx;">

		</view>

		<view class="content-bg" v-if="(receivingRecord.payState === 'UNPAID'|| receivingRecord.payState === 'PAID_FAIL') && receivingRecord.state === 'RECEIVED'">
			<view style="" class="uni-flex uni-row content-btn-box">
				<view class="flex-item">
					<button v-if="receivingRecord.state === 'NOT_RECEIVED'" class="rest-date-btn" @click="onCancel">取消寄件</button>
					<button v-else class="rest-date-btn" @click="showCancel = true">取消寄件</button>
				</view>
				<view class="flex-item" style="margin-left: 24rpx;">
					<button class="refuse-btn" @tap="pay">支付</button>
				</view>
			</view>
		</view>
		
		<van-popup :show="showCancel" bind:close="onClose">
			<view class="show-rest-date-box">
				<view class="show-rest-date-title">取消揽件</view>
				<image class="show-rest-date-img" src="../../../static/img/ikon_1.png" mode=""></image>
				<view class="show-rest-date-desc">
					<view>该包裹已收揽，请联系快递小哥进行取消！</view>
				</view>
				<view class="uni-flex uni-row show-rest-date-btn-box">
					<view class="flex-item">
						<button @click="showCancel=false" class="show-rest-date-btn-l">取消</button>
					</view>
					<view class="flex-item">
						<button @click="showCancel=false" class="show-rest-date-btn-r">好的</button>
					</view>
				</view>
			</view>
			<image @click="showCancel=false" class="show-box-close" src="../../../static/img/close.png"></image>
		</van-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				agreeChecked: false,
				showCancel: false,
				receivingRecord: {

				},
				code: '',
				showRestDate: false,
				showRefuse: false,
				buttonTopMargin: '0rpx',
				buttonBottomMargin: '0rpx'
			};
		},
		onLoad(o) {
			let vm = this;
			vm.code = o.code;
			if (vm.code) {
				vm.loadDetail();
			}
		},
		methods: {
			phoneCall() {
				let vm = this;
				uni.makePhoneCall({
				    phoneNumber: vm.receivingRecord.waiterMobileNumber
				});
			},
			onClose() {
				this.showCancel=false
			},
			pay() {
				let vm = this;
				if (vm.code) {
					uni.request({
						url: vm.$api.wxMaAuth.receivingPay,
						data: {
							code: vm.code
						},
						header: {},
						success: (res) => {
							let wxCreateOrderResultJson = res.data.data.wxCreateOrderResultJson;
								console.log(wxCreateOrderResultJson)
							if (wxCreateOrderResultJson) {
								// 发起支付
								wx.requestPayment({
									timeStamp: wxCreateOrderResultJson.timeStamp,
									nonceStr: wxCreateOrderResultJson.nonceStr,
									package: wxCreateOrderResultJson.packageValue,
									signType: wxCreateOrderResultJson.signType,
									paySign: wxCreateOrderResultJson.paySign,
									
									success:function(wxres){
										uni.showModal({
											title: '温馨提示',
											confirmColor: '#DE1111',
											content: "支付完成！",
											success: function(r) {
												vm.loadDetail();
											}
										});
									},
									fail:function(wxres){
										console.log(2)
										console.log(wxres)
										console.log(wxres.data)
									},
									complete:function(wxres){
										console.log(3)
										console.log(wxres)
										console.log(wxres.data)
									}
								})
							} else {
								uni.showModal({
									title: '温馨提示',
									confirmColor: '#DE1111',
									content: "请求支付失败！",
									success: function(r) {
										vm.loadDetail();
									}
								});
							}
						}
					});
				}
			},
			getDeduction() {
				let vm = this;
				let s = '暂无抵扣(未用券或低于起用金额)';
				if (vm.receivingRecord.memberCouponCode) {
					s = '-' + vm.receivingRecord.discountAmount + '元 ( ' + vm.receivingRecord.couponNumber + ' )'
				}
				return s;
			},
			onCancel() {
				let vm = this;		
				uni.showModal({
					title: '温馨提示',
					confirmColor: '#DE1111',
					content: '是否确定取消寄件？',
					success: function(re) {
						if (re.confirm) {
							// 确认取消
							if (vm.code) {
								uni.request({
									url: vm.$api.receivingRecord.cancel,
									data: {
										code: vm.code
									},
									header: {},
									success: (res) => {
										uni.showModal({
											title: '温馨提示',
											confirmColor: '#DE1111',
											content: res.data.desc,
											success: function(r) {
												vm.loadDetail();
											}
										});
									}
								});
							}
						} else if (re.cancel) {
							console.log("放弃取消寄件")
						}
					}
				});
				
				
			},
			loadDetail() {
				let vm = this;
				if (vm.code) {
					uni.request({
						url: vm.$api.receivingRecord.detail,
						data: {
							code: vm.code
						},
						header: {},
						success: (res) => {
							if (res.data.status === 200) {
								vm.receivingRecord = res.data.data.receivingRecord
							}
						}
					});
				}
			},
			getStateName() {
				let vm = this;
				if (vm.receivingRecord.payState === 'PAID' && vm.receivingRecord.state === 'RECEIVED') {
					return '已寄件'
				}
				if (vm.receivingRecord.state === 'CANCELLED') {
					return '已取消'
				}
				if (vm.receivingRecord.state === 'NOT_RECEIVED') {
					return '待上门取件'
				}
				if (vm.receivingRecord.payState === 'UNPAID' && vm.receivingRecord.state === 'RECEIVED') {
					return '等待支付'
				}
				if (vm.receivingRecord.payState === 'PAID_FAIL' && vm.receivingRecord.state === 'RECEIVED') {
					return '支付失败'
				}
			}
		},
		created() {
			let vm = this;

		}
	}
</script>

<style lang="scss">
	
	.show-rest-date-box {
		width: 614rpx;
		text-align: center;
	
		.show-rest-date-title {
			font-size: 36rpx;
			font-weight: bold;
			height: 50rpx;
			line-height: 50rpx;
			margin-top: 60rpx;
			margin-bottom: 40rpx;
		}
	
		.show-rest-date-img {
			height: 246rpx;
			width: 311rpx;
		}
	
		.show-rest-date-desc {
			height: 40rpx;
			line-height: 40rpx;
			font-size: 28rpx;
			color: #666666;
			margin-top: 40rpx;
		}
	
		.show-rest-date-btn-box {
			display: flex;
			margin-top: 60rpx;
			margin-left: 43rpx;
			margin-bottom: 60rpx;
	
			.show-rest-date-btn-l {
				width: 260rpx;
				height: 76rpx;
				background: rgba(255, 231, 231, 1);
				border-radius: 10rpx;
				font-size: 30rpx;
				line-height: 76rpx;
				color: #DE1111;
				margin-right: 20rpx;
			}
	
			.show-rest-date-btn-r {
				width: 260rpx;
				height: 76rpx;
				background: rgba(222, 17, 17, 1);
				border-radius: 10rpx;
				font-size: 30rpx;
				line-height: 76rpx;
				color: #FFFFFF;
			}
		}
	}
	
	
	.colorDE1111 {
		color: #DE1111;
	}

	.hide-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.send-delivery-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #282828;

		.color999 {
			color: #999999;
		}

		.show-box-close {
			width: 60rpx;
			height: 60rpx;
			position: absolute;
			top: 24rpx;
			right: 24rpx;
		}

		.agree-box {
			margin-top: 1117rpx;
			margin-left: 28rpx;
			height: 40rpx;
			line-height: 40rpx;

			.agree-checkbox {}

			.van-checkbox__label {
				margin-left: 0rpx;
			}

		}

		.info-box {
			position: relative;
			height: 180rpx;

			.state-head-img {
				height: 180rpx;
				width: 702rpx;
			}

			.state-desc {
				position: absolute;
				font-size: 46rpx;
				height: 65rpx;
				line-height: 65rpx;
				color: #FF3B0D;
				font-weight: bold;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}

		.form-box {
			display: flex;
			background-color: #FFFFFF;
			font-size: 32rpx;
			line-height: 40rpx;
			padding: 40rpx 40rpx;
			color: #666666;
			width: 622rpx;


			.form-item-label {
				width: 112rpx;
				font-size: 28rpx;
				color: #666666;
				height: 40rpx;
				line-height: 40rpx;
			}

			.form-item-value {
				text-align: right;
				width: 510rpx;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				color: #282828;
			}

			.form-item-no-delivery-time {
				height: 300rpx;
			}

			.form-item-border {
				width: 100%;
				height: 2rpx;
				background-color: #EAEAEA;
			}

		}


		.form-item-border {
			width: 100%;
			height: 2rpx;
			background-color: #EAEAEA;
		}

		.building-select-box {
			height: 518rpx;
			width: 100%;
		}


		.content-bg {
			background-color: #EDF1F5;
			width: 100%;

			.order-button {
				width: 702rpx;
				height: 98rpx;
				color: #FFFFFF;
				background-color: #DE1111;
				border-radius: 8rpx;
				margin: 860rpx 28rpx 193rpx 28rpx;
				font-size: 36rpx;
			}

			.content-btn-box {
				display: flex;
				margin: 1200rpx 24rpx 168rpx 24rpx;

				.rest-date-btn {
					background-color: #FFFFFF;
					border-radius: 6px;
					width: 339rpx;
					height: 98rpx;
					font-size: 36rpx;
				}

				.refuse-btn {
					background-color: #DE1111;
					border-radius: 6px;
					width: 339rpx;
					height: 98rpx;
					font-size: 36rpx;
					color: #FFFFFF;
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
				width: 622rpx;
				margin-bottom: 10rpx;
				background-color: #FFFFFF;
				position: relative;
				padding: 40rpx 40rpx 42rpx 40rpx;

				.courier-info-box {
					width: 622rpx;
					display: flex;

					.courier-name {
						display: flex;
						font-size: 32rpx;
						font-weight: bold;
						margin: 0 28rpx 10rpx 88rpx;
						height: 45rpx;
						line-height: 45rpx;
					}

				}

				.courier-desc {
					height: 40rpx;
					line-height: 40rpx;
					font-size: 28rpx;
					color: #666666;
					margin-left: 88rpx;
					margin-bottom: 10rpx;
				}

				.icon_11 {
					position: absolute;
					width: 60rpx;
					height: 60rpx;
					top: 52rpx;
					left: 40rpx;
					background-color: #DE1111;
					color: #FFFFFF;
					font-size: 32rpx;
					line-height: 60rpx;
					text-align: center;
				}

				.icon_12 {
					position: absolute;
					width: 60rpx;
					height: 60rpx;
					top: 229rpx;
					left: 40rpx;
					background-color: #FF9F1E;
					color: #FFFFFF;
					font-size: 32rpx;
					line-height: 60rpx;
					text-align: center;
				}
			}


		}

		.send-delivery-title-box {
			position: absolute;
			top: 100rpx;
			left: 24rpx;
			text-align: left;
			color: #FFFFFF;

			.send-delivery-title {
				font-size: 46rpx;
				margin-bottom: 10rpx;
			}

			.send-delivery-subtitle {
				font-size: 36rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>
