<template>
	<view class="my-order" ref="container">
		<view class="list">
			<view class="item" v-for="(order, orderListIndex) in orderList" :key="orderListIndex">
				<view class="title acea-row row-between-wrapper">
					<view class="acea-row row-middle">
						快递单号：{{ order.orderId || '未生成快递单号' }}
					</view>
					<view class="font-color-red">配送数量：{{ order.putCount || 0 }}</view>
				</view>
				<view @click="goOrderDetails(order)">
					<view class="item-info acea-row row-between row-top">
						<view class="pictrue">
							<image
								:src="order.productInfo.image"
							/>
						</view>
						<view class="text acea-row row-between">
							<view class="pei-name line2">
								<view class="text-cut">
									是否签收：{{ order.storeName || '否'}}
								</view>
							</view>
							<view class="money" style="text-align: left;">
								<view>配送员：{{ order.cartNum || '未知' }}</view>
								<view>配送时间：{{ order.putDate || ''}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="totalPrice">
					<text class="text-cut">收件地址：{{ order.userAddress }}</text>
				</view>
				<view class="bottom acea-row row-right row-middle">
					<template v-if="order._status._type == 0 || order._status._type == 9">
						<view class="bnt bg-blue" @tap="comfirm">确认收件</view>
					</template>
				</view>
			</view>
		</view>
		<view class="noCart" v-if="orderList.length === 0 && page > 1">
			<view class="pictrue"><image :src="`${$VUE_APP_RESOURCES_URL}/images/noOrder.png`" /></view>
		</view>
		<Loading :loaded="loaded" :loading="loading"></Loading>
		</view>
</template>
<script>
import { pojectDetail } from '@/api/order';
import Loading from '@/components/Loading';
import { mapGetters } from 'vuex';
import { isWeixin, dataFormat } from '@/utils';
let timer;
export default {
	data() {
		return {
			offlinePayStatus: 2,
			orderData: {},
			type: '',
			page: 1,
			limit: 20,
			timeText: '',
			loaded: false,
			loading: false,
			orderList: [],
			attr: {
			  cartAttr: false,
			  productAttr: [],
			  productSelect: {},
			},
			pay: false,
			payType: ['yue', 'weixin'],
			from: this.$deviceType
		};
	},
	components: {
		Loading,
	},
	computed: mapGetters(['userInfo']),
	onShow: function() {
		this.getOrderList(this.$yroute.query);
	},
	onHide: function() {
		this.orderList = [];
		this.page = 1;
		this.limit = 20;
		this.loaded = false;
		this.loading = false;
	},
	onUnload: function() {
		this.orderList = [];
		this.page = 1;
		this.limit = 20;
		this.loaded = false;
		this.loading = false;
	},
	methods: {
		comfirm(order){
			uni.showToast({
				title: '此功能暂未开放',
				icon: 'none',
				duration: 2000
			});
		},
		dataFormat,
		getOrderList(params) {
			console.log(params)
			let that = this
			if (this.loading || this.loaded) return;
			this.loading = true;
			pojectDetail(
			params
			).then(res => {
				that.orderList = [...res.data];
				that.page++;
				//这里应该写在请求接口拿到数据后，这里我使用模拟数据
				that.loaded = res.data.length < that.limit;
				that.loading = false;
			});
		},
	},
	mounted() {},
	onReachBottom() {
		!this.loading && this.getOrderList();
	}
};
</script>

<style scoped lang="less">
.noCart {
	margin-top: 0.17 * 100rpx;
	padding-top: 0.1 * 100rpx;
}

.noCart .pictrue {
	width: 4 * 100rpx;
	height: 3 * 100rpx;
	overflow: hidden;
	margin: 0.7 * 100rpx auto 0.5 * 100rpx auto;
}

.noCart .pictrue image {
	width: 4 * 100rpx;
	height: 3 * 100rpx;
}
.pei-name{
	width: 400rpx;
	color: #282828;
}
</style>
