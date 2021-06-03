<template>
	<view class="my-coupon-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_8.png"></image>
		<view class="my-coupon-title-box">
			<view class="my-coupon-title">
				我的优惠券
			</view>
			<view class="my-coupon-subtitle">
				My Coupons
			</view>
		</view>
		<view class="coupon-box">
			<view>
				<view class="coupon-item" :key="index" v-for="(item,index) in list">

					<view @click="onClick(item)">
						<image v-if="item.state === 'NOT_USED'" class="item-bg" src="/static/img/bg_11.png"></image>
						<image v-if="item.state === 'USED'" class="item-bg" src="/static/img/bg_11_r.png"></image>
						<view class="coupon-info-box">
							<view class="coupon-info-l">
								<view class="start-amount-box">满{{item.startingAmount}}元可用</view>
								<view class="coupon-amount">
									<text class="min-amount">￥</text>
									<text class="max-amount">{{item.discountAmount}}</text>
								</view>
								<view class="amount-desc">优惠金额</view>
							</view>
							<view class="coupon-info-r">
								<view class="coupon-info">{{item.name}}</view>
								<view class="coupon-info">卡券用途：寄件</view>
								<view class="coupon-info">截止时间：{{item.endTime | dateFormat('yyyy-MM-dd HH:mm:ss')}}</view>
								<view class="coupon-info">卡券编号：{{item.number}}</view>
							</view>
						</view>
						<view v-if="item.state === 'NOT_USED'" class="type-box bgDE1">未使用</view>
						<view v-else class="type-box bg999">已使用</view>
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
				member: null
			};
		},
		onLoad(option) {
			let vm = this;
			vm.pageFlag = option.pageFlag;
			vm.member = vm.$store.getters.getMember;
			if (vm.member) {
				vm.loadList();
				vm.setBgHeight();
			} else {
				if(vm.pageFlag === 'index') {
					let pages = getCurrentPages(); // 当前页面
					let beforePage = pages[pages.length - 2]; // 前一个页面
					uni.navigateBack({
						success: function() {
							beforePage.onLoad(); // 执行前一个页面的onLoad方法
						}
					});
				} else {
					uni.navigateBack();
				}
			}
		},
		methods: {
			onClick(item) {
				let vm = this;
				if (vm.pageFlag === 'index') {
					
				} else if (vm.pageFlag === 'sendDelivery'){
					if (item.state === 'USED') {
						
						uni.showModal({
						    title: '温馨提示',
							confirmColor: '#DE1111',
						    content: '该优惠券已使用，请选择其他优惠券',
						    success: function (res) {}
						});
						
						return;
					}
					console.log(item)
					let receivingForm = vm.$store.getters.getReceivingForm;
					if (receivingForm) {
						receivingForm.memberCouponCode = item.code;
						receivingForm.discountAmount = item.discountAmount;
					}
					
					vm.$store.dispatch("addReceivingForm", receivingForm);
					
					let pages = getCurrentPages(); // 当前页面
					let beforePage = pages[pages.length - 2]; // 前一个页面
					uni.navigateBack({
						success: function() {
							beforePage.onLoad(); // 执行前一个页面的onLoad方法
						}
					});
					
				}
			},
			loadList() {
				let vm = this;
				uni.request({
					url: vm.$api.memberCoupon.list,
					data: {
						onPage: false,
						memberCode: vm.member.code
					},
					header: {},
					success: (res) => {
						vm.list = res.data.data.memberCoupons
						vm.setBgHeight();
					}
				})
			},
			setBgHeight() {
				let vm = this;
				if (vm.list && vm.list.length) {
					vm.listIsNull = false;
					let len = vm.list.length;
					let count = 1000;
					if (len > 3) {
						count += (272 * (len - 3));
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
	.my-coupon-content {
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

		.coupon-box {
			display: flex;
			position: absolute;
			top: 320rpx;
			width: 702rpx;

			.coupon-item {
				display: flex;
				width: 702rpx;
				margin-bottom: 10rpx;



				.item-bg {
					width: 702rpx;
					height: 262rpx;
				}

				.coupon-info-box {
					position: absolute;
					top: 0;
					left: 0;
					display: flex;

					.coupon-info-l {
						width: 196rpx;
						border-right: 2rpx dashed #DE1111;
						height: 262rpx;
						position: relative;

						.start-amount-box {
							width: 196rpx;
							height: 56rpx;
							font-size: 30rpx;
							color: #DE1111;
							line-height: 56rpx;
							text-align: center;
							background-color: #FFE6E6;
							position: absolute;
							top: 0;
							left: 0;
						}

						.coupon-amount {
							color: #DE1111;
							font-weight: bold;
							height: 84rpx;
							line-height: 84rpx;
							margin: 67rpx 0rpx 10rpx 60rpx;

							.min-amount {
								font-size: 24rpx;
							}

							.max-amount {
								font-size: 60rpx;
							}

						}

						.amount-desc {
							color: #999999;
							font-size: 24rpx;
							height: 33rpx;
							line-height: 33rpx;
							margin-left: 60rpx;
						}
					}

					.coupon-info-r {
						padding-top: 34rpx;
						padding-left: 41rpx;

						.coupon-info {
							font-size: 28rpx;
							height: 40rpx;
							line-height: 40rpx;
							color: #666666;
							margin-bottom: 10rpx;

						}

					}

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

				.bgDE1 {
					background-color: #DE1111;
				}

				.bg999 {
					background-color: #999999;
				}
			}


		}

		.my-coupon-title-box {
			position: absolute;
			top: 100rpx;
			left: 24rpx;
			text-align: left;
			color: #FFFFFF;

			.my-coupon-title {
				font-size: 46rpx;
				margin-bottom: 10rpx;
			}

			.my-coupon-subtitle {
				font-size: 36rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>
