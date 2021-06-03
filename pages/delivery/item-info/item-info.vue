<template>
	<view class="address-info-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_4.png"></image>
		<view class="address-info-title-box">
			<view class="address-info-title">
				物品信息
			</view>
			<view class="address-info-subtitle">
				Item Information
			</view>
		</view>

		<view class="form-box">
			<form @submit="formSubmit" @reset="formReset">
				<textarea v-model="form.articleInfo" class="item-desc" placeholder="请输入寄件物品"></textarea>
				<view class="form-item-border"></view>
				<view class="rule-desc">
					禁寄物品：各种枪支弹药、易燃易爆、化学危险品、毒品、各类生物制品，传染性感染性物质、各类非法伪造/侵权物品...
				</view>
				<view class="uni-flex uni-row last-box">
					<view class="flex-item num-count-label">
						预估重量（KG）
					</view>
					<view class="flex-item btns-box uni-row">
						<image @click="sub" class="cut-no-btn flex-item" src="/static/img/cut_no.png"></image>
						<view class="num-count flex-item">
							{{form.weight}}
						</view>
						<image @click="add" class="add-btn flex-item" src="/static/img/add.png"></image>
					</view>
				</view>
			</form>
		</view>
		<view class="content-bg">
			<button @click="save" class="address-info-button">确定</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					articleInfo: '',
					weight: 0.5
				}
			};
		},
		onLoad() {
			let vm = this;
			let receivingForm = vm.$store.getters.getReceivingForm;
			if (receivingForm) {
				vm.form = receivingForm;
			}
		},
		methods: {
			sub() {
				let vm = this;
				if (vm.form.weight === 0.5 || vm.form.weight < 0.5) {
					vm.form.weight = 0.5
				} else {
					vm.form.weight -= 0.5;
				}
			},
			add() {
				let vm = this;
				vm.form.weight += 0.5;
			},
			save() {
				let vm = this;
				
				if (!vm.form.articleInfo) {
					uni.showModal({
					    title: '温馨提示',
						confirmColor: '#DE1111',
					    content: '请填写物品信息！',
					    success: function (res) {}
					});
					return;
				}
				
				vm.$store.dispatch('addReceivingForm', vm.form);
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 前一个页面
				uni.navigateBack({
					success: function() {
						beforePage.onLoad(); // 执行前一个页面的onLoad方法
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.address-info-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #282828;

		.popup-title-box {
			display: flex;
			height: 84rpx;
			width: 100%;
			font-size: 32rpx;

			.popup-title-right-button {
				height: 51rpx;
				line-height: 51rpx;
				margin: 16rpx 30rpx 16rpx 0;
				text-align: right;
				width: 50%;
			}

			.popup-title-left-button {
				height: 51rpx;
				line-height: 51rpx;
				width: 50%;
				margin: 16rpx 0 16rpx 30rpx;
			}
		}

		.popup-border {
			width: 100%;
			height: 1rpx;
			background-color: #DDDDDD;
		}

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

			.address-info-button {
				margin: 565rpx 24rpx 325rpx 24rpx;
				background-color: #DE1111;
				font-size: 36rpx;
				border-radius: 6px;
				width: 702rpx;
				height: 98rpx;
				color: #FFFFFF;
			}
		}

		.head-img {
			width: 750rpx;
			height: 460rpx;
		}

		.form-box {
			display: flex;
			background-color: #FFFFFF;
			position: absolute;
			top: 320rpx;
			font-size: 32rpx;
			line-height: 40rpx;
			padding: 0 40rpx;
			color: #666666;

			.item-desc {
				margin-top: 60rpx;
				line-height: 45rpx;
				margin-top: 40rpx;
				height: 180rpx;
				margin-bottom: 40rpx;
			}

			.rule-desc {
				font-size: 24rpx;
				color: #999999;
				line-height: 33rpx;
				width: 622rpx;
				word-break: break-all;
				white-space: pre-line;
				overflow: hidden;
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
				margin-bottom: 49rpx;
			}

			.last-box {
				display: flex;
				margin-top: 100rpx;
				margin-bottom: 60rpx;

				.num-count-label {
					height: 45rpx;
					font-size: 32rpx;
					line-height: 45rpx;
					width: 239rpx;
					color: #666666;
				}

				.btns-box {
					display: flex;
					margin-left: 188rpx;

					.cut-no-btn {
						width: 50rpx;
						height: 50rpx;

					}

					.add-btn {
						width: 50rpx;
						height: 50rpx;
					}

					.num-count {
						width: 95rpx;
						height: 50rpx;
						line-height: 50rpx;
						text-align: center;
						font-size: 36rpx;
					}
				}

			}


		}

		.address-info-title-box {
			position: absolute;
			top: 100rpx;
			left: 24rpx;
			text-align: left;
			color: #FFFFFF;

			.address-info-title {
				font-size: 46rpx;
				margin-bottom: 10rpx;
			}

			.address-info-subtitle {
				font-size: 36rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>
