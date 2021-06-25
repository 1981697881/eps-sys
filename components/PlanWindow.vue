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
						<view class="itemn">
							2020-01-01 00:00:00
						</view>
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
		</view>
		<view class="mask" @touchmove.prevent :hidden="attr.cartAttr === false" @click="closeAttr"></view>
	</view>
</template>
<script>
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
		}
	},
	data: function() {
		return {
			deliveryQuantity: 1,
			deliveryDate: 1
		};
	},
	mounted: function() {
		console.log(this);
	},
	watch: {},
	methods: {
		closeAttr: function() {
			this.$emit('changeFun', { action: 'changeattr', value: false });
		},
		CartNumDes: function() {
			this.$emit('changeFun', { action: 'ChangeCartNum', value: false });
		},
		CartNumAdd: function() {
			this.$emit('changeFun', { action: 'ChangeCartNum', value: 1 });
		},
		CartDeliveryDes: function() {
			this.deliveryQuantity--;
		},
		CartDeliveryAdd: function() {
			this.deliveryQuantity++;
		},
		CartDateDes: function() {
			this.deliveryDate--;
		},
		CartDateAdd: function() {
			this.deliveryDate++;
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
