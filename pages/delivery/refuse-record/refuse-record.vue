<template>
	<view class="refuse-record-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_3.png"></image>
		<view class="refuse-record-title-box">
			<view class="refuse-record-title">
				预先拒收拦截
			</view>
			<view class="refuse-record-subtitle">
				Early Rejection
			</view>
		</view>
		<view class="courier-box">
			<view>
				<view class="courier-item" :key="index" v-for="(item,index) in list" @click="showUpdateBox(item)">

					<view>
						<view class="uni-flex flex-item uni-row courier-info-box">
							<view class="courier-label flex-item">
								快递单号
							</view>
							<view class="courier-number flex-item">
								{{item.trackingNumber}}
							</view>
						</view>
						<view class="flex-item courier-desc">
							{{item.description}}
						</view>
						<view class="flex-item courier-state">{{getRefuseRecordStateName(item.state)}}</view>
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
			 class="refuse-record-button" type="warn" @click="showRefuseBox">添加预先拒收件</button>
		</view>


		<van-popup :show="showRefuse" bind:close="onClose">
			<view class="show-refuse-box">
				<view v-if="isUpdate" class="show-refuse-title">修改预先拒收运单号</view>
				<view v-else class="show-refuse-title">添加预先拒收运单号</view>
				<view class="show-refuse-desc">可提前填写希望拒收的快递单号，该快递到驿站后，若快递单号匹配提前设置的 “拒收单号”，该快递件将默认为拒收，自动退回</view>
				<view class="show-refuse-input-box">
					<input v-model="form.trackingNumber" class="show-refuse-input" type="text" placeholder="请输入需要预先拦截的运单号" />
				</view>
				<textarea v-model="form.description" class="show-refuse-textarea" placeholder-style="color:#999999" placeholder="请填写拒收理由"></textarea>
				<view class="uni-flex uni-row show-refuse-btn-box">
					<view class="flex-item">
						<button @click="cancel" class="show-refuse-btn-l">{{isUpdate?'删除':'取消'}}</button>
					</view>
					<view class="flex-item">
						<button @click="formSubmit" class="show-refuse-btn-r">{{isUpdate?'修改':'添加'}}</button>
					</view>
				</view>
			</view>
			<image @click="showRefuse=false" class="show-box-close" src="../../../static/img/close.png"></image>
		</van-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				buttonTopMargin: '0rpx',
				buttonBottomMargin: '0rpx',
				listIsNull: true,
				showRefuse: false,
				isUpdate: false,
				form: {
					trackingNumber: '',
					description: ''
				},
				member: {}
			};
		},
		onLoad() {
			let vm = this;
			vm.setMyCourierButtonTopMargin();
			vm.member = vm.$store.getters.getMember;
			if (!vm.member) {
				uni.navigateBack();
			} else {
				vm.loadList();
			}
			vm.setMyCourierButtonTopMargin();
		},
		methods: {
			cancel() {
				let vm = this;
				if (vm.isUpdate) {
					uni.request({
						url: vm.$api.memberRefuseRecord.delete,
						data: {
							code: vm.form.code
						},
						header: {},
						success: (res) => {
							uni.showModal({
								title: '温馨提示',
								confirmColor: '#DE1111',
								content: res.data.desc,
								success: function(res) {
									vm.loadList();
								}
							});
						}
					})
				}
				vm.showRefuse = false;
			},
			showUpdateBox(item) {
				let vm = this;
				vm.form = item;
				vm.isUpdate = true;
				vm.showRefuse = true;
			},
			showRefuseBox() {
				let vm = this;
				vm.form = {
					trackingNumber: '',
					description: ''
				}
				vm.isUpdate = false
				vm.showRefuse = true;
			},
			loadList() {
				let vm = this;
				uni.request({
					url: vm.$api.memberRefuseRecord.list,
					data: {
						onPage: false,
						memberCode: vm.member.code
					},
					header: {},
					success: (res) => {
						vm.list = res.data.data.memberRefuseRecords
						if (vm.list && vm.list.length > 0) {
							vm.listIsNull = false
						}
						vm.setMyCourierButtonTopMargin();
					}
				})
			},
			formSubmit() {
				let vm = this;
				// 校验
				if (!vm.form.trackingNumber) {
					vm.msgDesc = "";
					uni.showModal({
						title: '温馨提示',
						confirmColor: '#DE1111',
						content: '快递单号不能为空，请填写！',
						success: function(res) {}
					});
					return;
				}
				if (!vm.form.description) {
					vm.msgDesc = "";
					uni.showModal({
						title: '温馨提示',
						confirmColor: '#DE1111',
						content: '拒收原因描述不能为空，请填写！',
						success: function(res) {}
					});
					return;
				}
				
				vm.showRefuse = false;
				
				let obj = {
					memberCode: vm.member.code,
					trackingNumber: vm.form.trackingNumber,
					description: vm.form.description
				}
				
				let url = vm.$api.memberRefuseRecord.add;
				
				if (vm.isUpdate) {
					obj.code = vm.form.code;
					url = vm.$api.memberRefuseRecord.update;
				}
				
				uni.request({
					url: url,
					data: obj,
					header: {},
					success: (res) => {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: res.data.desc,
							success: function(res) {
								vm.loadList();
							}
						});
					}
				})
				
			},
			getRefuseRecordStateName(state) {
				let vm = this;
				switch (state) {
					case 'NOT_ARRIVED':
						return '驿站未接手';
					case 'ARRIVED':
						return '已到站，即将自动退回';
					case 'RETURNED':
						return '已退回';
					default:
						return '暂无信息';
				}
			},
			setMyCourierButtonTopMargin() {
				let vm = this;
				let len = 0;
				if (vm.list && vm.list.length) {
					len = vm.list.length;
				}

				if (len === 0) {
					vm.listIsNull = true;
					vm.buttonBottomMargin = 500 + 'rpx';
					// vm.buttonTopMargin = 500 + 'rpx';
					return;
				}
				let defaultSize = 346;
				let total = defaultSize * len - 73;
				vm.buttonTopMargin = total + 'rpx';
				if (total === 0) {
					vm.buttonBottomMargin = 500 + 'rpx'
				} else if (total > 700) {
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

	.refuse-record-content {
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

		.show-box-close {
			width: 60rpx;
			height: 60rpx;
			position: absolute;
			top: 24rpx;
			right: 24rpx;
		}


		.content-bg {
			background-color: #EDF1F5;
			width: 100%;

			.refuse-record-button {
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
				height: 160rpx;
				width: 420rpx;
				margin-left: 97rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				color: #666666;
				margin-top: 40rpx;
			}

			.show-refuse-input {
				height: 40rpx;
				width: 474rpx;
				background-color: #F5F5F5;
				border-radius: 10rpx;
				border: 2px solid #EAEAEA;
				text-align: left;
				padding: 24rpx 30rpx;
				margin-top: 40rpx;
				margin-left: 40rpx;
			}

			.show-refuse-textarea {
				width: 474rpx;
				height: 205rpx;
				background-color: #F5F5F5;
				border-radius: 10rpx;
				border: 2px solid #EAEAEA;
				padding: 30rpx;
				margin: 10rpx 40rpx 0 40rpx;
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
					color: #DE1111;
					margin-right: 20rpx;
				}

				.show-refuse-btn-r {
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

		.courier-box {
			display: flex;
			position: absolute;
			top: 320rpx;
			width: 702rpx;

			.courier-item {
				display: flex;
				width: 622rpx;
				padding: 40rpx;
				margin-bottom: 10rpx;
				background-color: #FFFFFF;

				.courier-info-box {
					width: 622rpx;
					height: 130rpx;
					display: flex;
					height: 56rpx;
					margin-bottom: 40rpx;

					.courier-label {
						width: 118rpx;
						height: 56rpx;
						font-size: 24rpx;
						line-height: 56rpx;
						background-color: #282828;
						color: #FFFFFF;
						text-align: center;
					}

					.courier-number {
						font-size: 36rpx;
						line-height: 56rpx;
						font-weight: bold;
						margin-left: 28rpx;
					}

				}

				.courier-desc {
					line-height: 40rpx;
					height: 80rpx;
					text-align: left;
					font-size: 28rpx;
					color: #666666;
					width: 622rpx;
					word-break: break-all;
					// word-wrap: break-word;
					white-space: pre-line;
					overflow: hidden;
					// 无效
					// display: -webkit-box;
					// text-overflow: ellipsis;
					// -webkit-box-orient: vertical;
					// -webkit-line-clamp: 2;
				}

			}

			.courier-state {
				margin-top: 40rpx;
				text-align: right;
				height: 40rpx;
				line-height: 40rpx;
				color: #DE1111;
			}
		}

		.refuse-record-title-box {
			position: absolute;
			top: 100rpx;
			left: 24rpx;
			text-align: left;
			color: #FFFFFF;

			.refuse-record-title {
				font-size: 46rpx;
				margin-bottom: 10rpx;
			}

			.refuse-record-subtitle {
				font-size: 36rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>
