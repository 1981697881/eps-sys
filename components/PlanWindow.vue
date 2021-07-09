<template>
	<view>
		<view class="product-window" :class="attr.cartAttr === true ? 'on' : ''">
			<view class="textpic acea-row row-between-wrapper">
				<view class="pictrue">
					<image @tap="previewImage" src="http://img.alicdn.com/bao/uploaded/i1/132691477/O1CN01uFj7651MmVXObEOla_!!0-item_pic.jpg_310x310.jpg" class="image" />
				</view>
				<view class="iconfont icon-guanbi" @click="closeAttr"></view>
				<view class="text">
					<view class="line1">商品</view>
					<view class="money font-color-red">
						<text class="num">123</text>
						<text class="stock">订单数量: 10</text>
					</view>
				</view>
			</view>
			<view class="productWinList">
				<view class="item">
					<view class="title">起送时间</view>
					<view class="listn acea-row row-middle">
						<!-- <view class="picker">
								{{date}}
							</view> -->
						<picker mode="date" :value="date" :start="start" :end="end" @change="DateChange" class="itemn">{{ date }}</picker>
					</view>
				</view>
			</view>
			<view class="cart">
				<view class="title">配送计划(每天配送数量/配送间隔天数)</view>
				<view class="acea-row">
					<view class="carnum acea-row row-left">
						<view class="item reduce" :class="deliveryQuantity <= 1 ? 'on' : ''" @click="CartDeliveryDes">-</view>
						<view class="item num">{{ deliveryQuantity }}</view>
						<view class="item plus" :class="deliveryQuantity >= cartNum ? 'on' : ''" @click="CartDeliveryAdd">+</view>
					</view>
					<view style="margin-left: 80rpx;" class="carnum acea-row row-left">
						<view class="item reduce" :class="deliveryDate <= 1 ? 'on' : ''" @click="CartDateDes">-</view>
						<view class="item num">{{ deliveryDate }}</view>
						<view class="item plus" :class="deliveryDate >= 5 ? 'on' : ''" @click="CartDateAdd">+</view>
					</view>
				</view>
			</view>
			<view class="cu-bar tabbar shadow foot">
				<view class="box text-center"><button class="cu-btn bg-green shadow-blur round" style="width: 40%;" @tap="$manyCk(saveData)">提交</button></view>
			</view>
		</view>
		<view class="mask" @touchmove.prevent :hidden="attr.cartAttr === false" @click="closeAttr"></view>
	</view>
</template>
<script>
import { getDayList } from '@/utils';
export default {
	name: 'PlanWindow',
	props: {
		attr: {
			type: Object,
			default: () => {}
		},
		cartNum: {
			type: Number,
			default: () => 1
		}, // 开始日期
		planDate: {
			type: String,
			default: function() {
				return getDayList('', 0).day;
			}
		}, // 开始日期
		start: {
			type: String,
			default: function() {
				return getDayList('', 0).day;
			}
		},
		// 结束日期
		end: {
			type: String,
			default: function() {
				return getDayList('', 15).day;
			}
		}
	},
	data: function() {
		return {
			deliveryQuantity: 1,
			deliveryDate: 1,
			date: ''
		};
	},
	mounted: function() {
		this.date = this.planDate
		console.log(this);
	},
	watch: {},
	methods: {
		DateChange(e) {
			this.date = e.detail.value;
		},
		closeAttr: function() {
			this.$emit('changeFun', { action: 'changeattr', value: false });
		},
		CartDeliveryDes: function() {
			this.deliveryQuantity--;
		},
		CartDeliveryAdd: function() {
			if (this.deliveryQuantity >= this.cartNum) {
				return uni.showToast({
					title: '不能超出限定数量',
					icon: 'none',
					duration: 2000
				});
			} else {
				this.deliveryQuantity++;
			}
		},
		CartDateDes: function() {
			this.deliveryDate--;
		},
		CartDateAdd: function() {
			if (this.deliveryDate >= 5) {
				return uni.showToast({
					title: '不能超出限定数量',
					icon: 'none',
					duration: 2000
				});
			} else {
				this.deliveryDate++;
			}
		},
		previewImage() {
			uni.previewImage({
				current: 0,
				urls: [this.attr.productSelect.image]
			});
		}
	}
};
</script>
<style scoped lang="less">
.box {
	width: 100%;
}
.cu-bar {
	min-height: 30px;
}
</style>
