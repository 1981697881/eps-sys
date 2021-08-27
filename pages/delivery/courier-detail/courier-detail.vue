<template>
	<view class="courier-detail-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_2.png"></image>
		<view class="courier-detail-title-box">
			<view class="courier-detail-title">快递详情</view>
			<view class="courier-detail-subtitle">Courier Detail</view>
		</view>
		<view class="courier-box">
			<view>
				<view class="courier-item">
					<view>
						<view class="uni-flex flex-item uni-row courier-info-box">
							<view class="courier-name flex-item">{{ deliveryRecord.businessName }}</view>
						</view>
						<view class="flex-item courier-desc" style="margin-bottom: 40rpx;">{{ deliveryRecord.trackingNumber }}</view>
					</view>
				</view>
				<view class="info-box">
					<image mode="scaleToFill" class="state-head-img" src="/static/img/bg_10.png"></image>
					<view class="state-desc">{{ getStateName(deliveryRecord.state) }}</view>
				</view>
				<view class="uni-flex  uni-row form-box">
					<view class="uni-flex uni-row form-item" style="display: flex;" v-if="deliveryRecord.state != 'SIGNED' && deliveryRecord.state != 'REFUSE'">
						<view class="flex-item form-item-label">取件方式</view>
						<view class="flex-item form-item-value">{{ deliveryRecord.deliveryMethodName }}</view>
					</view>
					<view class="form-item-border" v-if="deliveryRecord.state != 'SIGNED' && deliveryRecord.state != 'REFUSE'"></view>

					<view class="uni-flex uni-row form-item" style="display: flex;" v-if="deliveryRecord.state === 'WAIT'">
						<view class="flex-item form-item-label">预计派送时间</view>
						<view class="flex-item form-item-value">{{ deliveryRecord.deliveryTimes }}</view>
					</view>
					<view class="form-item-border" v-if="deliveryRecord.state === 'WAIT'"></view>

					<view class="uni-flex uni-row form-item" style="display: flex;" v-if="deliveryRecord.state === 'WAIT_SIGNED'">
						<view class="flex-item form-item-label">到站时间</view>
						<view class="flex-item form-item-value">{{ deliveryRecord.createTime }}</view>
					</view>
					<view class="form-item-border" v-if="deliveryRecord.state === 'WAIT_SIGNED'"></view>

					<view class="uni-flex uni-row form-item" style="display: flex;" v-if="deliveryRecord.state === 'DELIVERING' || deliveryRecord.state === 'EXCEPTION'">
						<view class="flex-item form-item-label">派送时间</view>
						<view class="flex-item form-item-value">{{ deliveryRecord.deliveryTimes }}</view>
					</view>
					<view class="form-item-border" v-if="deliveryRecord.state === 'DELIVERING' || deliveryRecord.state === 'EXCEPTION'"></view>

					<view
						@click.stop="phoneCall"
						class="uni-flex uni-row form-item"
						style="display: flex;"
						v-if="deliveryRecord.state === 'DELIVERING' || deliveryRecord.state === 'SIGNED' || deliveryRecord.state === 'EXCEPTION'"
					>
						<view class="flex-item form-item-label">派送信息</view>
						<view class="flex-item form-item-value">{{ deliveryRecord.deliveryman + ' ' + deliveryRecord.deliverymanMobileNumber }}</view>
					</view>
					<view class="form-item-border" v-if="deliveryRecord.state === 'DELIVERING' || deliveryRecord.state === 'SIGNED'|| deliveryRecord.state === 'EXCEPTION'"></view>

					<view class="uni-flex uni-row form-item" style="display: flex;" v-if="deliveryRecord.state === 'EXCEPTION'">
						<view class="flex-item form-item-label">异常原因</view>
						<view class="flex-item form-item-value">{{ deliveryRecord.exceptionDesc }}</view>
					</view>
					<view class="form-item-border" v-if="deliveryRecord.state === 'EXCEPTION'"></view>

					<view class="uni-flex uni-row form-item" style="display: flex;" v-if="deliveryRecord.state === 'SIGNED' || deliveryRecord.state === 'REFUSE'">
						<view class="flex-item form-item-label">{{ deliveryRecord.state === 'SIGNED' ? '签收时间' : '拒收时间' }}</view>
						<view class="flex-item form-item-value">{{ deliveryRecord.signedTime }}</view>
					</view>
					<view class="form-item-border"></view>
					<view class="uni-flex uni-row form-item" style="display: flex;">
						<view class="flex-item form-item-label">投诉电话</view>
						<view class="flex-item form-item-value" @click.stop="phoneKfCall('18620738175')">18620738175</view>
					</view>
					<view class="form-item-border" v-if="deliveryRecord.state === 'SIGNED' || deliveryRecord.state === 'REFUSE'" style="margin-bottom: 91rpx;"></view>
					<view class="uni-flex uni-row form-item" style="display: flex;" v-if="deliveryRecord.state != 'SIGNED' && deliveryRecord.state != 'REFUSE'">
						<image class="flex-item" src="/static/img/icon_6.png" style="width: 30rpx;height: 36rpx;transform: translateY(4rpx);"></image>
						<view class="flex-item" style="color: #FF9F1E;margin-left: 24rpx; height: 40rpx;line-height: 40rpx;">请保持手机通畅</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content-bg">
			<view
				:style="{ marginTop: buttonTopMargin, marginBottom: buttonBottomMargin, marginLeft: '24rpx', marginRight: '24rpx' }"
				class="uni-flex uni-row content-btn-box"
				v-if="deliveryRecord.state != 'SIGNED' && deliveryRecord.state != 'REFUSE'"
			>
				<view class="flex-item"><button class="rest-date-btn" @click="showRestDate = true">更改派送时间</button></view>
				<view class="flex-item" style="margin-left: 24rpx;"><button class="refuse-btn" @click="showRefuse = true">拒收</button></view>
			</view>
			<view v-if="deliveryRecord.state === 'SIGNED' || deliveryRecord.state === 'REFUSE'" style="height: 988rpx;,width: 100%;"></view>
		</view>

		<van-popup :show="showRestDate" bind:close="onClose">
			<view class="show-rest-date-box">
				<view class="show-rest-date-title">更改派送时间</view>
				<image class="show-rest-date-img" src="../../../static/img/ikon_1.png" mode=""></image>
				<view class="show-rest-date-desc">电话联系派件员进行派送时间变更</view>
				<view class="uni-flex uni-row show-rest-date-btn-box">
					<view class="flex-item"><button @click="showRestDate = false" class="show-rest-date-btn-l">取消</button></view>
					<view class="flex-item"><button @click="showRestDate = false" class="show-rest-date-btn-r">好的</button></view>
				</view>
			</view>
			<image @click="showRestDate = false" class="show-box-close" src="../../../static/img/close.png"></image>
		</van-popup>

		<van-popup :show="showRefuse" bind:close="onClose">
			<view class="show-refuse-box">
				<view class="show-refuse-title">拒收快递件</view>
				<view class="show-refuse-desc">请确认是否 拒收 此快递件。点击“确认”将不再派送，并原路寄回</view>
				<textarea v-model="refuseDesc" class="show-refuse-textarea" placeholder-style="color:#999999;" placeholder="请填写拒收理由"></textarea>
				<view class="uni-flex uni-row show-refuse-btn-box">
					<view class="flex-item"><button @click="showRefuse = false" class="show-refuse-btn-l">取消</button></view>
					<view class="flex-item"><button @click="confirmRefuse" class="show-refuse-btn-r">确认拒收</button></view>
				</view>
			</view>
			<image @click="showRefuse = false" class="show-box-close" src="../../../static/img/close.png"></image>
		</van-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			deliveryRecord: {
				// state: "SIGNED",
				// state: "DELIVERING",
				// state: "WAIT",
				// state: "WAIT_SIGNED",
				// state: "EXCEPTION",
				// state: "REFUSE",
				// state: "",
				// deliveryMethod: "DELIVERY",
				// deliveryMethod: "SELF"
			},
			refuseDesc: '',
			showRestDate: false,
			code: '',
			showRefuse: false,
			buttonTopMargin: '0rpx',
			buttonBottomMargin: '0rpx'
		};
	},
	onLoad(option) {
		let vm = this;
		if (option.code) {
			vm.code = option.code;
			vm.loadDetail();
		}
		vm.setMyCourierButtonTopMargin();
	},
	methods: {
		phoneKfCall(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		phoneCall() {
			let vm = this;
			uni.makePhoneCall({
				phoneNumber: vm.deliveryRecord.deliverymanMobileNumber
			});
		},
		confirmRefuse() {
			let vm = this;
			uni.request({
				url: vm.$api.deliveryRecord.refuse,
				data: {
					trackingNumber: vm.deliveryRecord.trackingNumber,
					refuseDesc: vm.refuseDesc
				},
				header: {},
				success: res => {
					if (res.data.status === 200) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '已通知，派件员拒收，稍后请保持手机通畅！',
							success: function(res) {}
						});
					} else {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '拒收失败！',
							success: function(res) {}
						});
					}
					vm.setMyCourierButtonTopMargin();
					vm.showRefuse = false;
				}
			});
		},
		loadDetail() {
			let vm = this;
			uni.request({
				url: vm.$api.deliveryRecord.memberDeliveryDetail,
				data: {
					code: vm.code
				},
				header: {},
				success: res => {
					if (res.data.status === 200) {
						vm.deliveryRecord = res.data.data.deliveryRecord;
					} else {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '查询失败！',
							success: function(res) {
								uni.navigateBack();
							}
						});
					}
					vm.setMyCourierButtonTopMargin();
				}
			});
		},
		getStateName(state) {
			switch (state) {
				case 'SIGNED':
					return '已签收';
				case 'DELIVERING':
					return '派送中';
				case 'WAIT':
					return '已到站';
				case 'WAIT_SIGNED':
					return '待取货';
				case 'EXCEPTION':
					return '派件异常';
				case 'REFUSE':
					return '已拒收';
				default:
					return '未到站';
			}
		},
		setMyCourierButtonTopMargin() {
			let vm = this;
			switch (vm.deliveryRecord.state) {
				case 'SIGNED':
					vm.buttonTopMargin = '0rpx';
					vm.buttonBottomMargin = '0rpx';
					break;
				case 'DELIVERING':
					vm.buttonTopMargin = '814rpx';
					vm.buttonBottomMargin = '76rpx';
					break;
				case 'WAIT':
					vm.buttonTopMargin = '692rpx';
					vm.buttonBottomMargin = '198rpx';
					break;
				case 'WAIT_SIGNED':
					vm.buttonTopMargin = '692rpx';
					vm.buttonBottomMargin = '198rpx';
					break;
				case 'EXCEPTION':
					vm.buttonTopMargin = '934rpx';
					vm.buttonBottomMargin = '76rpx';
					break;
				case 'REFUSE':
					vm.buttonTopMargin = '0rpx';
					vm.buttonBottomMargin = '0rpx';
					break;
				default:
					vm.buttonTopMargin = '692rpx';
					vm.buttonBottomMargin = '198rpx';
					break;
			}
		}
	},
	created() {
		let vm = this;
	}
};
</script>

<style lang="scss">
.courier-detail-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: #282828;

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
				color: #de1111;
				margin-right: 20rpx;
			}

			.show-rest-date-btn-r {
				width: 260rpx;
				height: 76rpx;
				background: rgba(222, 17, 17, 1);
				border-radius: 10rpx;
				font-size: 30rpx;
				line-height: 76rpx;
				color: #ffffff;
			}
		}
	}

	.show-refuse-box {
		width: 614rpx;
		text-align: center;

		.show-refuse-title {
			font-size: 36rpx;
			font-weight: bold;
			height: 50rpx;
			line-height: 50rpx;
			margin-top: 60rpx;
			margin-bottom: 40rpx;
		}

		.show-refuse-desc {
			height: 80rpx;
			width: 420rpx;
			margin-left: 97rpx;
			line-height: 40rpx;
			font-size: 28rpx;
			color: #666666;
			margin-top: 40rpx;
		}

		.show-refuse-textarea {
			width: 474rpx;
			height: 205rpx;
			background-color: #f5f5f5;
			border-radius: 10rpx;
			border: 2px solid #eaeaea;
			padding: 30rpx;
			margin: 40rpx 40rpx 0 40rpx;
			text-align: left;
		}

		.show-refuse-btn-box {
			display: flex;
			margin-top: 60rpx;
			margin-left: 43rpx;
			margin-bottom: 60rpx;

			.show-refuse-btn-l {
				width: 260rpx;
				height: 76rpx;
				background: rgba(255, 231, 231, 1);
				border-radius: 10rpx;
				font-size: 30rpx;
				line-height: 76rpx;
				color: #de1111;
				margin-right: 20rpx;
			}

			.show-refuse-btn-r {
				width: 260rpx;
				height: 76rpx;
				background: rgba(222, 17, 17, 1);
				border-radius: 10rpx;
				font-size: 30rpx;
				line-height: 76rpx;
				color: #ffffff;
			}
		}
	}

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
			color: #ff3b0d;
			font-weight: bold;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.form-box {
		background-color: #ffffff;
		padding: 0 40rpx;

		.form-item {
			padding: 40rpx 0;

			.form-item-label {
				height: 40rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				width: 168rpx;
				color: #666666;
			}

			.form-item-value {
				height: 40rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				width: 454rpx;
				text-align: right;
			}
		}

		.form-item-border {
			width: 100%;
			height: 2rpx;
			background-color: #eaeaea;
		}
	}

	.building-select-box {
		height: 518rpx;
		width: 100%;
	}

	.content-bg {
		background-color: #edf1f5;
		width: 100%;

		.content-btn-box {
			display: flex;
			margin: 800rpx 24rpx 198rpx 24rpx;

			.rest-date-btn {
				background-color: #ffffff;
				border-radius: 6px;
				width: 339rpx;
				height: 98rpx;
				font-size: 36rpx;
			}

			.refuse-btn {
				background-color: #de1111;
				border-radius: 6px;
				width: 339rpx;
				height: 98rpx;
				font-size: 36rpx;
				color: #ffffff;
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
			background-color: #ffffff;

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
				background-color: #fff9ef;
				color: #e88500;
				font-size: 28rpx;
			}

			.courier-error {
				height: 40rpx;
				line-height: 40rpx;
				padding: 28rpx 0rpx 28rpx 40rpx;
				background-color: #ffefef;
				color: #de1111;
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
				color: #ffffff;
			}
		}
	}

	.courier-detail-title-box {
		position: absolute;
		top: 100rpx;
		left: 24rpx;
		text-align: left;
		color: #ffffff;

		.courier-detail-title {
			font-size: 46rpx;
			margin-bottom: 10rpx;
		}

		.courier-detail-subtitle {
			font-size: 36rpx;
			color: rgba(255, 255, 255, 0.5);
		}
	}
}
</style>
