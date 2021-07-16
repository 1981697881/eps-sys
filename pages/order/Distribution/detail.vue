<template>
	<view class="my-order" ref="container">
		<view class="list">
			<view class="item" v-for="(order, orderListIndex) in orderList" :key="orderListIndex">
				<view class="title acea-row row-between-wrapper">
					<view class="acea-row row-middle">
						快递单号：{{ order.orderId }}
					</view>
					<view class="font-color-red">配送数量：{{ order.cartInfo.length || 0 }}</view>
				</view>
				<view @click="goOrderDetails(order)">
					<view class="item-info acea-row row-between row-top" v-for="(cart, cartInfoIndex) in order.cartInfo" :key="cartInfoIndex">
						<view class="pictrue">
							<image
								:src="cart.productInfo.image"
							/>
						</view>
						<view class="text acea-row row-between">
							<view class="pei-name line2">
								<view class="text-cut">
									是否签收：{{ cart.productInfo.storeName }}
								</view>
							</view>
							<view class="money" style="text-align: left;">
								<view>配送员：{{ cart.productInfo.attrInfo ? cart.productInfo.attrInfo.price : cart.productInfo.price }}</view>
								<view>配送时间：{{ cart.cartNum }}</view>
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
import { getOrderData, getYsOrderList,getOrderList } from '@/api/order';
import { cancelOrderHandle, payOrderHandle, takeOrderHandle } from '@/libs/order';
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
		this.type = parseInt(this.$yroute.query.type) || 0;
		this.changeType(this.type);
		this.getOrderData();
		this.getOrderList();
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
		changeFun: function(opt) {
		 if (typeof opt !== 'object') opt = {}
		 let action = opt.action || ''
		 let value = opt.value === undefined ? '' : opt.value
		 this[action] && this[action](value)
		},
		changeattr: function(msg) {
		  // 修改了规格
		  this.attr.cartAttr = msg
		},
		comfirm(order){
			uni.showToast({
				title: '此功能暂未开放',
				icon: 'none',
				duration: 2000
			});
		},
		getPlan(){
			this.attr.cartAttr = true 
		},
		stopPlan(){
			this.$refs['customModal'].showModal()
		},
		cancel(val){
			console.log(val) 
		},
		 confirm(val){
			console.log(val) 
		 },
		goLogistics(order) {
			this.$yrouter.push({
				path: '/pages/order/Logistics/index',
				query: { id: order.orderId }
			});
		},
		goOrderDetails(order) {
			this.$yrouter.push({
				path: '/pages/order/OrderDetails/index',
				query: { id: order.orderId }
			});
		},
		dataFormat,
		setOfflinePayStatus: function(status) {
			var that = this;
			that.offlinePayStatus = status;
			if (status === 1) {
				if (that.payType.indexOf('offline') < 0) {
					that.payType.push('offline');
				}
			}
		},
		getOrderData() {
			getOrderData().then(res => {
				this.orderData = res.data;
			});
		},
		takeOrder(order) {
			takeOrderHandle(order.orderId).finally(() => {
				this.reload();
				this.getOrderData();
			});
		},
		reload() {
			this.changeType(this.type);
		},
		changeType(type) {
			let that = this
			this.type = type;
			this.orderList = [];
			this.page = 1;
			this.loaded = false;
			this.loading = false;
			this.getOrderList();
		},
		getOrderList() {
			let that = this
			if (this.loading || this.loaded) return;
			this.loading = true;
			const { page, limit, type } = this;
			getOrderList({
				page,
				limit,
				type
			}).then(res => {
				that.orderList = [...res.data];
				that.page++;
				//这里应该写在请求接口拿到数据后，这里我使用模拟数据
				that.loaded = res.data.length < that.limit;
				that.loading = false;
			});
		},
		toPay() {}
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
