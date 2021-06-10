<template>
	<view class="index-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_1.png"></image>
		<view class="user-info-shadow"></view>
		<view class="user-info">
			<view class="user-name-mobile-box" v-if="isLogin">
				<text class="flex-item user-name">{{ member.realName }}</text>
				<text class="flex-item user-mobile">{{ member.mobileNumber }}</text>
			</view>
			<view class="user-address-box uni-flex uni-row" v-if="isLogin">
				<view class="flex-item user-address-label">收货地址</view>
				<view class="flex-item user-address">{{ member.buildingNameAndHouseNumber }}</view>
			</view>
			<view v-if="!isLogin"><button @getuserinfo="getWxUserInfo" open-type="getUserInfo">点击注册/登录</button></view>
		</view>

		<view class="menu-list-box">
			<view class="flex-item tr-b-bottom menu-tr uni-flex uni-row">
				<view class="menu-td flex-item" @tap="goToMyCourier">
					<image class="meun-icon" src="/static/img/icon_1.png"></image>
					<view>我的快递</view>
				</view>
				<view class="menu-td flex-item" @tap="goToUserInfo">
					<image class="meun-icon" src="/static/img/icon_2.png"></image>
					<view>个人信息</view>
				</view>
			</view>

			<view class="flex-item tr-b-bottom menu-tr uni-flex uni-row">
				<view class="menu-td flex-item" @tap="goToSendDelivery">
					<image class="meun-icon" src="/static/img/icon_3.png"></image>
					<view>我要寄件</view>
				</view>
				<view class="menu-td flex-item" @tap="goToMyDelivery">
					<image class="meun-icon" src="/static/img/icon_4.png"></image>
					<view>我的寄件</view>
				</view>
			</view>

			<view class="flex-item menu-tr uni-flex uni-row">
				<view class="menu-td flex-item" @tap="goToMyCoupon">
					<image class="meun-icon" src="/static/img/icon_5.png"></image>
					<view>我的优惠劵</view>
				</view>
				<view class="menu-td flex-item" @tap="goToMyShop">
					<image class="meun-icon" src="/static/img/icon_11.png"></image>
					<view>鲜奶到家</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showMsgBox: false,
			msgDesc: '',
			userInfo: {},
			member: {},
			isLogin: false,
			showGoToLogin: false
		};
	},
	onLoad(option) {
		let vm = this;
		let member = vm.$store.getters.getMember;
		let jump = option ? (option.jump ? option.jump : '') : '';
		if (member && member.code) {
			vm.isLogin = true;
			vm.member = member;
			if (jump) {
				uni.navigateTo({
					url: '/pages/' + jump + '/' + jump + '?pageFlag=index'
				});
			}
		} else {
			vm.login(jump);
		}
	},
	methods: {
		login(jump) {
			let vm = this;
			uni.showLoading({
				title: '登录中...'
			});
			uni.login({
				success: res => {
					console.log(res);
					console.log(vm.$api.wxMaAuth.login);
					uni.request({
						url: vm.$api.wxMaAuth.login,
						data: {
							code: res.code
						},
						header: {},
						success: res => {
							vm.$store.dispatch('addUserInfo', res.data.data.userInfo);
							uni.hideLoading();
							if (res.data.data.member === null) {
								vm.isLogin = false;
							} else {
								// 自动登录
								vm.member = res.data.data.member;
								vm.$store.dispatch('addMember', vm.member);
								vm.isLogin = true;
								// 自动登陆完后判断是否有跳转请求
								if (jump) {
									uni.navigateTo({
										url: '/pages/' + jump + '/' + jump + '?pageFlag=index'
									});
								}
							}
						}
					});
				},
				fail: () => {
					console.log('未授权');
				}
			});
		},
		closeMsgBox() {
			let vm = this;
			vm.showMsgBox = false;
		},
		getWxUserInfo() {
			let vm = this;
			uni.getUserInfo({
				success: res => {
					// 获取用户信息后跳转
					vm.$store.dispatch('addNickname', res.userInfo.nickName);
					uni.navigateTo({
						url: '/pages/delivery/register/register?pageFlag=index'
					});
				},
				fail: () => {
					console.log('未授权');
				}
			});
		},
		goToMyCoupon() {
			let vm = this;
			let member = vm.$store.getters.getMember;
			if (member) {
				uni.navigateTo({
					url: '/pages/my-coupon/my-coupon?pageFlag=index'
				});
				return;
			} else {
				uni.showModal({
					title: '温馨提示',
					confirmColor: '#DE1111',
					content: '请先注册或登录后在访问！',
					success: function(res) {
						if (res.confirm) {
						}
					}
				});
			}
		},
		goToMyShop() {
			uni.navigateToMiniProgram({
			  appId: 'wxa2323bbede6c8196',
			  path: 'wxa/pages/offlinePay/index',
			  extraData: {
				  
			  },
			  envVersion: 'release',
			  success(res) {
				  console.log(res)
			    // 打开成功
			  },fail(res) {
				  console.log(res)
			    // 打开失败
			  },
			})
		},
		goToMyDelivery() {
			let vm = this;
			let member = vm.$store.getters.getMember;
			if (member) {
				uni.navigateTo({
					url: '/pages/my-delivery/my-delivery?pageFlag=index'
				});
				return;
			} else {
				uni.showModal({
					title: '温馨提示',
					confirmColor: '#DE1111',
					content: '请先注册或登录后在访问！',
					success: function(res) {
						if (res.confirm) {
						}
					}
				});
			}
		},
		goToSendDelivery() {
			let vm = this; 
			let member = vm.$store.getters.getMember;
			if (member) {
				uni.navigateTo({
					url: '/pages/send-delivery/send-delivery?pageFlag=index'
				});
				return;
			} else {
				uni.showModal({
					title: '温馨提示',
					confirmColor: '#DE1111',
					content: '请先注册或登录后在访问！',
					success: function(res) {
						if (res.confirm) {
						}
					}
				});
			}
		},
		goToUserInfo() {
			let vm = this;
			let member = vm.$store.getters.getMember;
			if (member) {
				uni.navigateTo({
					url: '/pages/user-info/user-info?pageFlag=index'
				});
			} else {
				uni.showModal({
					title: '温馨提示',
					confirmColor: '#DE1111',
					content: '请先注册或登录后在访问！',
					success: function(res) {}
				});
			}
		},
		goToMyCourier() {
			let vm = this;
			let member = vm.$store.getters.getMember;
			if (member) {
				uni.navigateTo({
					url: '/pages/my-courier/my-courier?pageFlag=index'
				});
			} else {
				uni.showModal({
					title: '温馨提示',
					confirmColor: '#DE1111',
					content: '请先注册或登录后在访问！',
					success: function(res) {}
				});
			}
		}
	}
};
</script>

<style lang="scss">
.index-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: #282828;
	background-color: #FFF;
	.head-img {
		width: 750rpx;
		height: 460rpx;
	}

	.msg-box {
		text-align: center;
		width: 622rpx;
		border-radius: 10rpx;

		.msg-desc {
			font-size: 32rpx;
			color: #999999;
			line-height: 40rpx;
			margin: 40rpx;
		}

		.msg-btn {
			font-size: 36rpx;
			color: #de1111;
			border-top: 1rpx solid #999999;
			padding-top: 20rpx;
			margin-bottom: 40rpx;
			line-height: 40rpx;
		}
	}

	.user-info {
		height: 214rpx;
		width: 702rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		position: absolute;
		top: 320rpx;
		padding: 40rpx;

		button::after {
			border: none;
		}

		button {
			font-size: 36rpx;
			font-weight: bold;
			color: #282828;
			text-align: left;
			background-color: #ffffff;
			height: 134rpx;
			line-height: 134rpx;
		}

		.user-name-mobile-box {
			display: flex;
			height: 78rpx;

			.user-name {
				font-size: 36rpx;
				font-weight: bold;
				color: #282828;
				margin-right: 28rpx;
			}

			.user-mobile {
				color: #999999;
				padding-top: 8rpx;
			}

			line-height: 36rpx;
			vertical-align: bottom;
		}

		.user-address-box {
			display: flex;
			border: 1rpx #282828 solid;

			.user-address-label {
				width: 118rpx;
				height: 56rpx;
				background-color: #282828;
				color: #ffffff;
				font-size: 24rpx;
				line-height: 56rpx;
				text-align: center;
				vertical-align: middle;
			}

			.user-address {
				padding-left: 24rpx;
				text-align: left;
				vertical-align: middle;
				line-height: 56rpx;
			}
		}
	}

	.user-info-shadow {
		width: 662rpx;
		height: 190rpx;
		background: linear-gradient(#ff9f1e, #ffffff);
		position: absolute;
		top: 364rpx;
	}

	.menu-list-box {
		margin-top: 112rpx;
		margin-bottom: 222rpx;

		.menu-tr {
			display: flex;

			.menu-td {
				width: 350rpx;
				height: 218rpx;
				border: 1rpx solid #eaeaea;
				margin: 0 -1rpx -1rpx 0;
				text-align: center;

				.meun-icon {
					width: 70rpx;
					height: 70rpx;
					margin-top: 40rpx;
					margin-bottom: 28rpx;
				}
			}
		}
	}
}
</style>
