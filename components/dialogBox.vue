<template>
	<view v-if="isShowModal">
		<view class="masking" v-if="showMasking" :style="{'background-color': bgColor}"></view>
		<view class="model-wraper">
			<view class="modal-title" v-if="modalTitle !== ''">
				{{modalTitle}}
			</view>
			<view class="modal-body">
				<view class="cu-form-group">
					<view class="title">日期选择</view>
					<picker mode="date" :value="inputSerialNum" :start="start" :end="end" @change="DateChange">
						<view class="picker">
							{{inputSerialNum}}
						</view>
					</picker>
				</view>
				<!-- <input v-model="inputSerialNum" style="padding: 10rpx;font-size: 30rpx;" class="uni-input" focus placeholder="设备序列号" /> -->
			</view>
			<view>
				<view class="btn cancel" :style="{'color': cancelTextColor}" @click="handleCancel">{{cancelText}}</view>
				<view class="btn confirm" :style="{'color': confirmTextColor}" @click="handleConfirm">{{confirmText}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getDayList } from "@/utils";
	export default {
		props: {
			// 是否显示蒙层
			showMasking: {
				type: Boolean,
				default: true
			},
			// 蒙层背景色
			bgColor: {
				type: String,
				default: 'rgba(0,0,0,.6)'
			},
			// 模态框标题
			modalTitle: {
				type: String,
				default: ''
			},
			// 取消按钮文字
			cancelText: {
				type: String,
				default: '取消'
			},
			// 确定按钮文字
			confirmText: {
				type: String,
				default: '确定'
			},
			// 取消按钮文字颜色
			cancelTextColor: {
				type: String,
				default: '#666'
			},
			// 确定按钮文字颜色
			confirmTextColor: {
				type: String,
				default: '#5999FF'
			},
			// 开始日期
			start: {
				type: String,
				default: function () {
				   return getDayList('', 0).day 
				}
			},
			// 结束日期
			end: {
				type: String,
				default: function () {
				    return getDayList('', 15).day 
				}
			}
		},
		data() {
			return {
				isShowModal: false,
				inputSerialNum: getDayList('', 0).day
			}
		},
		methods: {
			DateChange(e) {
				this.inputSerialNum = e.detail.value
			},
			showModal() {
				this.isShowModal = true
			},
			handleCancel() {
				this.isShowModal = false
				this.$emit('onClickCancel', 'cancel')
			},
			handleConfirm() {
				this.isShowModal = false
				this.$emit('onClickConfirm', this.inputSerialNum)
			}
		}
	}
</script>

<style scoped>
	.masking {
		height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}

	.model-wraper {
		width: 600rpx;
		background-color: #fff;
		border-radius: 16rpx;
		position: absolute;
		z-index: 1000;
		top: 50%;
		left: 50%;
		margin-top: -161rpx;
		margin-left: -300rpx;
		box-shadow: #dcdcdc 0px 0px 20rpx;
	}

	.modal-title {
		height: 90rpx;
		line-height: 90rpx;
		width: 100%;
		text-align: center;
		font-size: 32rpx;
		color: #666;
	}

	.modal-body {
		padding: 30rpx 30rpx 80rpx 30rpx;
	}

	.btn {
		width: 300rpx;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		font-size: 32rpx;
		float: left;
		border-top: 1rpx solid #ddd;
	}

	.btn.cancel {
		width: 299rpx;
		border-right: 1rpx solid #dcdcdc;
	}
</style>
