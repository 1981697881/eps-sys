<template>
	<view>
		<view class="product-window" :class="attr.cartAttr === true ? 'on' : ''">
			<view class="textpic acea-row row-between-wrapper">
				<view class="pictrue">
					<image @tap="previewImage" :src="attr.cart.productInfo.image" class="image" />
				</view>
				<view class="iconfont icon-guanbi" @click="closeAttr"></view>
				<view class="text">
					<view class="line1">{{attr.cart.productInfo.storeName}}</view>
					<view class="money font-color-red">
						<!-- <text class="num">{{attr.cart.productInfo.}}</text> -->
						<text class="stock">订单数量: {{attr.totalNum}}</text>
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
						<picker mode="date" :value="startDate" :start="start" :end="end" @change="DateChange" class="itemn">{{ startDate }}</picker>
					</view>
				</view>
			</view>
			<view class="cart">
				<view class="title">配送计划(每天配送数量/配送间隔天数)</view>
				<view class="acea-row">
					<view class="carnum acea-row row-left">
						<view class="item reduce" :class="dayCount <= 1 ? 'on' : ''" @click="CartDeliveryDes">-</view>
						<view class="item num">{{ dayCount }}</view>
						<view class="item plus" :class="dayCount >= attr.cart.cartNum ? 'on' : ''" @click="CartDeliveryAdd">+</view>
					</view>
					<view style="margin-left: 80rpx;" class="carnum acea-row row-left">
						<view class="item reduce" :class="dayNumber <= 1 ? 'on' : ''" @click="CartDateDes">-</view>
						<view class="item num">{{ dayNumber }}</view>
						<view class="item plus" :class="dayNumber >= 5 ? 'on' : ''" @click="CartDateAdd">+</view>
					</view>
				</view>
			</view>
			<view class="cu-bar tabbar shadow foot">
				<view class="box text-center"><button class="cu-btn bg-green shadow-blur round" style="width: 40%;" @tap="saveData">提交</button></view>
			</view>
		</view>
		<view class="mask" @touchmove.prevent :hidden="attr.cartAttr === false" @click="closeAttr"></view>
	</view>
</template>
<script>
import { getDayList } from '@/utils';
import { setPoject } from '@/api/order';
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
			dayCount: 1,
			dayNumber: 1,
			startDate: ''
		};
	},
	mounted: function() {
		this.startDate = this.planDate
		console.log(this);
	},
	watch: {},
	methods: {
		DateChange(e) {
			this.startDate = e.detail.value;
		},
		closeAttr: function() {
			this.$emit('changeFun', { action: 'changeattr', value: false });
		},
		CartDeliveryDes: function() {
			if(this.dayCount >1){
				this.dayCount--;
			}
		},
		saveData(){
			let that = this
			setPoject({
				productId: this.attr.cart.productId,
				orderId: this.attr.orderId,
				startDate: this.startDate,
				dayCount: this.dayCount,
				allCount: this.attr.cart.cartNum,
				dayNumber: this.dayNumber,
			}).then(res => {
				uni.showToast({
					title: res.msg,
					icon: 'none',
					duration: 2000
				});
				this.$emit('changeFun', { action: 'changeattr', value: false });
			});
		},
		CartDeliveryAdd: function() {
			if (this.dayCount >= this.attr.cart.cartNum) {
				return uni.showToast({
					title: '不能超出限定数量',
					icon: 'none',
					duration: 2000
				});
			} else {
				this.dayCount++;
			}
		},
		CartDateDes: function() {
			if(this.dayNumber-- >1){
				this.dayNumber--;
			}
		},
		CartDateAdd: function() {
			if (this.dayNumber >= 5) {
				return uni.showToast({
					title: '间隔天数不能大于5天',
					icon: 'none',
					duration: 2000
				});
			} else {
				this.dayNumber++;
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
