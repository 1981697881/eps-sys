<template>
	<view class="send-delivery-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_6.png"></image>
		<view class="send-delivery-title-box">
			<view class="send-delivery-title">
				我要寄件
			</view>
			<view class="send-delivery-subtitle">
				Send Delivery
			</view>
		</view>
		<view class="courier-box">
			<view>
				<view class="courier-item">
					<view @tap="goToAddressInfo('sender')" v-if="form.sender">
						<view class="uni-flex flex-item uni-row courier-info-box">
							<view class="courier-name flex-item uni-row">
								<view class="flex-item">{{form.sender}}</view>
								<view class="flex-item" style="margin-left: 28rpx;">{{form.senderMobileNumber}}</view>
							</view>
						</view>
						<view class="flex-item courier-desc" style="margin-bottom: 40rpx;">
							{{getNotSpaceName(form.senderAreaName) + form.senderAddress}}
						</view>
					</view>
					<view v-else @tap="goToAddressInfo('sender')">
						<view class="uni-flex flex-item uni-row courier-info-box">
							<view class="courier-name flex-item uni-row"></view>
						</view>
						<view class="flex-item courier-desc" style="margin-bottom: 40rpx;"></view>
						<view class="info_tip_1 color999">请填写寄件人地址信息</view>
					</view>
					<view class="icon_11">寄</view>
					<view class="flex-item form-item-border"></view>

					<view @tap="goToAddressInfo('addressee')" v-if="form.addressee">
						<view class="uni-flex flex-item uni-row courier-info-box" style="margin-top: 40rpx;">
							<view class="courier-name flex-item uni-row">
								<view class="flex-item">{{form.addressee}}</view>
								<view class="flex-item" style="margin-left: 28rpx;">{{form.addresseeMobileNumber}}</view>
							</view>
						</view>
						<view class="flex-item courier-desc">
							{{getNotSpaceName(form.addresseeAreaName) + form.addresseeAddress}}
						</view>
					</view>
					<view v-else @tap="goToAddressInfo('addressee')">
						<view class="uni-flex flex-item uni-row courier-info-box" style="margin-top: 40rpx;">
							<view class="courier-name flex-item uni-row"></view>
						</view>
						<view class="flex-item courier-desc"></view>
						<view class="info_tip_2 color999">请填写收件人地址信息</view>
					</view>
					<view class="icon_12">收</view>
				</view>

				<view class="form-box">
					<view>
						<view class="uni-flex  uni-row form-item" @tap="showBusiness=true">
							<view class="flex-item form-item-label">快递公司</view>
							<view class="flex-item uni-row form-item-arrow">
								<text v-if="selectBusinessNameIsNull" class="form-item-arrow-text color999">请选择</text>
								<text v-else class="form-item-arrow-text color28">{{selectBusinessName}}</text>
								<image class="form-icon-arrow" src="/static/img/arrow_1.png"></image>
							</view>
						</view>

						<view class="flex-item form-item-border"></view>

						<view class="uni-flex  uni-row form-item" @tap="showTimes=true">
							<view class="flex-item form-item-label">预计上门时间</view>
							<view class="flex-item uni-row form-item-arrow">
								<text v-if="selectTimesNameIsNull" class="form-item-arrow-text color999">请选择</text>
								<text v-else class="form-item-arrow-text color28">{{selectTimesName}}</text>
								<image class="form-icon-arrow" src="/static/img/arrow_1.png"></image>
							</view>
						</view>

						<view class="flex-item form-item-border"></view>

						<view class="uni-flex  uni-row form-item" @tap="goToItemInfo">
							<view class="flex-item form-item-label" style="width: 136rpx;">物品信息</view>
							<view class="flex-item uni-row form-item-arrow" style="width: 492rpx;">
								<text v-if="selectItemInfoNameIsNull" style="width: 447rpx;" class="hide-text form-item-arrow-text color999">请填写</text>
								<text v-else style="width: 447rpx;" class="hide-text form-item-arrow-text color28">{{selectItemInfoName}}</text>
								<image class="form-icon-arrow" src="/static/img/arrow_1.png"></image>
							</view>
						</view>

						<view class="flex-item form-item-border"></view>

						<view class="uni-flex  uni-row form-item" @tap="goToMyCoupon">
							<view class="flex-item form-item-label">优惠劵使用</view>
							<view class="flex-item uni-row form-item-arrow">
								<text v-if="selectDiscountAmountNameIsNull" style="width: 447rpx;" class="hide-text form-item-arrow-text color999">请选择</text>
								<text v-else style="width: 447rpx;" class="hide-text form-item-arrow-text colorDE1111">-{{form.discountAmount}}元</text>
								<image class="form-icon-arrow" src="/static/img/arrow_1.png"></image>
							</view>
						</view>

						<view class="flex-item form-item-border"></view>

						<textarea v-model="form.remarks" class="form-textarea" placeholder-style="color:#999999" placeholder="输入备注，给快递员留言"></textarea>
					</view>

				</view>
			</view>

		</view>

		<view class="content-bg">

			<view class="agree-box">
				<van-checkbox custom-class="agree-checkbox" :value="agreeChecked" shape="square" @change="agreeChecked = !agreeChecked">
					<text style="margin-left: 28rpx;">我已阅读并同意</text>
					<text style="color: #DE1111;">《寄件条款》</text>
				</van-checkbox>
			</view>

			<button @click="order" class="order-button" type="warn">下单</button>
		</view>

		<van-popup :close-on-click-overlay="true" position="bottom" :show="showBusiness" @close="closeBusiness">
			<van-picker column-class="picker-column" toolbar-class="picker-toolbar" :show-toolbar="true" :columns="businessColumns"
			 @cancel="onCancelBusiness" @confirm="onConfirmBusiness" :item-height="40" />
		</van-popup>

		<van-popup :close-on-click-overlay="true" position="bottom" :show="showTimes" @close="closeTimes">
			<van-picker column-class="picker-column" toolbar-class="picker-toolbar" :show-toolbar="true" :columns="timesColumns"
			 @cancel="onCancelTimes" @confirm="onConfirmTimes" :item-height="40" />
		</van-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				agreeChecked: false,
				showTimes: false,
				showBusiness: false,
				member: {},
				form: {
					sender: '',
					senderMobileNumber: '',
					senderAddress: '',
					senderAreaNumber: '',
					senderAreaName: '',
					addressee: '',
					addresseeMobileNumber: '',
					addresseeAddress: '',
					addresseeAreaNumber: '',
					addresseeAreaName: '',
					deliveryTimeCode: '',
					business: '',
					articleInfo: '',
					weight: 0.5,
					remarks: '',
					memberCouponCode: '',
					discountAmount: 0

				},
				timesColumns: [{
					values: [],
					className: 'times-columns',
					defaultIndex: 0
				}],
				businessColumns: [{
					values: [],
					className: 'business-columns',
					defaultIndex: 0
				}],
				businessList: [],
				receivingTimes: [],
				selectTimesName: '',
				selectItemInfoName: '',
				selectBusinessName: '',
				selectBusinessNameIsNull: true,
				selectTimesNameIsNull: true,
				selectItemInfoNameIsNull: true,
				selectDiscountAmountNameIsNull: true,
				buttonTopMargin: '0rpx',
				buttonBottomMargin: '0rpx'
			};
		},
		onLoad(option) {
			let vm = this;
			vm.loadBusiness();
			vm.loadTimes();
			if (option && option.pageFlag === 'index') {
				return;
			}

			let receivingForm = vm.$store.getters.getReceivingForm;
			console.log(receivingForm)
			if (receivingForm) {
				vm.form = receivingForm;

				if (vm.form.articleInfo) {
					vm.selectItemInfoName = vm.form.articleInfo + '，重' + (vm.form.weight ? vm.form.weight : 0) + 'kg';
					vm.selectItemInfoNameIsNull = false;
				}

				if (vm.form.memberCouponCode) {
					vm.selectDiscountAmountNameIsNull = false
				}
			}

		},
		methods: {
			order() {
				let vm = this;
				if (vm.agreeChecked) {

					if (!vm.form.sender) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '请填写寄件人姓名！',
							success: function(res) {}
						});
						return;
					}

					if (!vm.form.senderMobileNumber) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '请填写寄件人手机号码！',
							success: function(res) {}
						});
						return;
					}

					if (!vm.form.senderAreaNumber) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '请选择寄件人地区！',
							success: function(res) {}
						});
						return;
					}

					if (!vm.form.senderAddress) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '请填写寄件人详细地址！',
							success: function(res) {}
						});
						return;
					}

					if (!vm.form.addressee) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '请填写收件人姓名！',
							success: function(res) {}
						});
						return;
					}

					if (!vm.form.addresseeMobileNumber) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '请填写收件人手机号码！',
							success: function(res) {}
						});
						return;
					}

					if (!vm.form.addresseeAreaNumber) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '请选择收件人地区！',
							success: function(res) {}
						});
						return;
					}

					if (!vm.form.addresseeAddress) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '请填写收件人详细地址！',
							success: function(res) {}
						});
						return;
					}


					if (!vm.form.business) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '请选择快递公司！',
							success: function(res) {}
						});
						return;
					}

					if (!vm.form.deliveryTimeCode) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '请选择上门时间！',
							success: function(res) {}
						});
						return;
					}

					if (!vm.form.articleInfo) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '请填写物品信息！',
							success: function(res) {}
						});
						return;
					}


					// 获取用户信息
					let member = vm.$store.getters.getMember;


					let obj = {
						memberCode: member.code,

						sender: vm.form.sender,
						senderMobileNumber: vm.form.senderMobileNumber,
						senderAddress: vm.form.senderAddress,
						senderAreaNumber: vm.form.senderAreaNumber,
						senderAreaName: vm.getNotSpaceName(vm.form.senderAreaName),

						addressee: vm.form.addressee,
						addresseeMobileNumber: vm.form.addresseeMobileNumber,
						addresseeAddress: vm.form.addresseeAddress,
						addresseeAreaNumber: vm.form.addresseeAreaNumber,
						addresseeAreaName: vm.getNotSpaceName(vm.form.addresseeAreaName),

						deliveryTimeCode: vm.form.deliveryTimeCode,
						dateType: vm.getDateType(vm.form.deliveryTimeCode),

						business: vm.form.business,
						articleInfo: vm.form.articleInfo,
						weight: vm.form.weight,
						remarks: vm.form.remarks,
						memberCouponCode: vm.form.memberCouponCode

					}	
					uni.request({
						url: vm.$api.receivingRecord.order,
						data: obj,
						header: {},
						success: (res) => {
							uni.showModal({
								title: '系统提示',
								confirmColor: '#DE1111',
								content: res.data.desc,
								success: function(r) {

									if (res.data.status === 200) {
										// 成功则返回
										uni.navigateBack();
									}
								}
							});


						}
					})




				} else {
					uni.showModal({
						title: '温馨提示',
						confirmColor: '#DE1111',
						content: '请先阅读并同意寄件条款！',
						success: function(res) {}
					});
					return;
				}
			},
			loadTimes() {
				let vm = this;
				uni.request({
					url: vm.$api.common.loadReceivingTimes,
					data: {},
					header: {},
					success: (res) => {
						vm.receivingTimes = res.data.data.receivingTimes;
						let newArr = []
						for (var i = 0; i < vm.receivingTimes.length; i++) {
							newArr.push({
								code: vm.receivingTimes[i].code,
								text: vm.receivingTimes[i].day + ' ' + vm.receivingTimes[i].times
							});
						}
						vm.timesColumns[0].values = newArr;
					}
				})
			},
			getDateType(code) {
				let vm = this;
				for (var i = 0; i < vm.receivingTimes.length; i++) {
					if (vm.receivingTimes[i].code === code) {
						return vm.receivingTimes[i].dateType;
					}
				}
				return 'TODAY';
			},
			loadBusiness() {
				let vm = this;
				uni.request({
					url: vm.$api.common.loadReceivingBusiness,
					data: {},
					header: {},
					success: (res) => {
						vm.businessList = res.data.data.businesses;
						let newArr = []
						for (var i = 0; i < vm.businessList.length; i++) {
							newArr.push({
								code: vm.businessList[i].value,
								text: vm.businessList[i].name
							});
						}
						vm.businessColumns[0].values = newArr;
					}
				})
			},
			onConfirmBusiness(event) {
				let vm = this;
				const {
					picker,
					value,
					index
				} = event.detail;
				vm.selectBusiness = value;
				vm.form.business = value[0].code;
				vm.selectBusinessName = value[0].text;
				vm.selectBusinessNameIsNull = false;
				vm.showBusiness = false;

			},
			onConfirmTimes(event) {
				let vm = this;
				const {
					picker,
					value,
					index
				} = event.detail;
				vm.selectTimes = value;
				vm.form.deliveryTimeCode = value[0].code;
				vm.selectTimesName = value[0].text;
				vm.selectTimesNameIsNull = false;
				vm.showTimes = false;

			},
			onCancelBusiness() {
				let vm = this;
				vm.showBusiness = false;
			},
			onCancelTimes() {
				let vm = this;
				vm.showTimes = false;
			},
			closeTimes() {
				let vm = this;
				vm.showTimes = false;
			},
			closeBusiness() {
				let vm = this;
				vm.showBusiness = false;
			},
			getNotSpaceName(name) {
				if (name) {
					return name.replaceAll(' ', '');
				}
				return '';
			},
			showForm() {

			},
			goToMyCoupon() {
				let vm = this;
				vm.$store.dispatch('addReceivingForm', vm.form);
				uni.navigateTo({
					url: "/pages/delivery/my-coupon/my-coupon?pageFlag=sendDelivery"
				});
			},
			goToItemInfo() {
				let vm = this;
				vm.$store.dispatch('addReceivingForm', vm.form);
				uni.navigateTo({
					url: "/pages/delivery/item-info/item-info"
				});
			},
			goToAddressInfo(type) {
				let vm = this;
				vm.$store.dispatch('addReceivingForm', vm.form);
				uni.navigateTo({
					url: "/pages/delivery/address-info/address-info?type=" + type
				});
			}
		},
		created() {
			let vm = this;
			vm.member = vm.$store.getters.getMember;
			if (vm.member) {
				console.log(vm.member)
				if (!vm.form.sender) {
					let obj = {
						sender: vm.member.realName,
						senderMobileNumber: vm.member.mobileNumber,
						senderAddress: vm.member.buildingNameAndHouseNumber,
						senderAreaNumber: '440113',
						senderAreaName: '广东省广州市番禺区',
						addressee: '',
						addresseeMobileNumber: '',
						addresseeAddress: '',
						addresseeAreaNumber: '',
						addresseeAreaName: '',
						deliveryTimeCode: '',
						business: '',
						articleInfo: '',
						weight: 0.5,
						remarks: '',
						memberCouponCode: '',
						discountAmount: 0
					}
					vm.form = obj;
					console.log(vm.form)
					
				}
				
			}

		}
	}
</script>

<style lang="scss">
	.hide-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.picker-toolbar {
		font-size: 32rpx;
		line-height: 84rpx;
		height: 84rpx;
		border-bottom: 1rpx solid #DDDDDD;

		.van-picker__cancel {
			color: #999999;
		}

		.van-picker__confirm {
			color: #DE1111;
		}
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
			padding: 0 40rpx;
			color: #666666;

			.form-textarea {
				margin-top: 40rpx;
				margin-bottom: 60rpx;
				width: 558rpx;
				height: 205rpx;
				background-color: #F5F5F5;
				border-radius: 10rpx;
				border: 2px solid #EAEAEA;
				padding: 30rpx;
				text-align: left;

			}

			.form-item {
				padding: 40rpx 0;
				display: flex;

				.form-item-label {
					width: 256rpx;
				}

				.form-item-input {
					text-align: right;
					height: 40rpx;
				}

				.form-item-arrow {
					display: flex;
					width: 366rpx;
					position: relative;

					.form-item-arrow-text {
						width: 321rpx;
						text-align: right;
					}

					.form-icon-arrow {
						width: 21rpx;
						height: 34rpx;
						margin-left: 24rpx;
						position: relative;
						top: 2rpx;

					}
				}

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
				margin: 100rpx 28rpx 168rpx 28rpx;
				font-size: 36rpx;
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
				/* width: 622rpx;*/
				margin-bottom: 10rpx;
				background-color: #FFFFFF;
				position: relative;
				padding: 40rpx 40rpx 42rpx 40rpx;

				.courier-info-box {
					/* width: 622rpx; */
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
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
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

				.info_tip_1 {
					position: absolute;
					top: 52rpx;
					left: 140rpx;
					font-size: 32rpx;
					line-height: 60rpx;
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

				.info_tip_2 {
					position: absolute;
					top: 229rpx;
					left: 140rpx;
					font-size: 32rpx;
					line-height: 60rpx;
				}
			}


		}

		.colorDE1111 {
			color: #DE1111;
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
