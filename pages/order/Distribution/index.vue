<template>
	<view class="my-order" ref="container">
		<view class="list">
			<view class="item" v-for="(order, orderListIndex) in orderList" :key="orderListIndex">
				<view class="title acea-row row-between-wrapper">
					<view class="acea-row row-middle">
						单号：{{ order.orderId }}
					</view>
					<view class="font-color-red">商品件数：{{ order.cartInfo.length || 0 }}</view>
				</view>
				<view>
					<view class="item-info acea-row row-between row-top" v-for="(cart, cartInfoIndex) in order.cartInfo" :key="cartInfoIndex" @click="goOrderDetails(order,cart)">
						<view class="pictrue">
							<image
								:src="cart.productInfo.image"
							/>
						</view>
						<view class="text acea-row row-between">
							<view class="pei-name line2">
								<view class="text-cut">
									{{ cart.productInfo.storeName }}
								</view>
								<view v-if="cart.isSetPoject =='true'">
									<button class="cu-btn round sm bg-cyan shadow" @tap.stop="getPlan(cart,order)">设定配送计划</button>
								</view>
								<view v-else>
									<text class="cu-btn round sm bg-blue shadow">系统默认或已设定配送计划</text>
									<button class="cu-btn round sm bg-pink shadow" @tap.stop="stopPlan(cart,order)">停止配送</button>
								</view>
							</view>
							<view class="money">
								<view v-if="order.payType != 'integral'">￥{{ cart.productInfo.attrInfo ? cart.productInfo.attrInfo.price : cart.productInfo.price }}</view>
								<view v-if="order.payType == 'integral'">{{ order.payIntegral }}积分</view>
								<view>x{{ cart.cartNum }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="totalPrice">
					<text class="text-cut">地址：{{ order.userAddress }}</text>
				</view>
				<!-- <view class="bottom acea-row row-right row-middle">
					<template v-if="order._status._type == 1 || order._status._type == 2">
						<view class="bnt bg-blue" @tap="planDetail(order)">配送明细</view>
						<view class="bnt bg-red" @tap="stopPlan(order)">停止配送</view>
					</template>
					<template v-if="order._status._type == 3">
						<view
						class="bnt default"
						@click="$yrouter.push({ path: '/pages/order/Logistics/index',query:{id:order.orderId}})"
						v-if="order.deliveryType == 'express'"
						>
						查看物流
						</view>
					</template>
				</view> -->
			</view>
		</view>
		<view class="noCart" v-if="orderList.length === 0 && page > 1">
			<view class="pictrue"><image :src="`${$VUE_APP_RESOURCES_URL}/images/noOrder.png`" /></view>
		</view>
		<Loading :loaded="loaded" :loading="loading"></Loading>
		<Payment v-model="pay" :types="payType" @checked="toPay" :balance="userInfo.nowMoney"></Payment>
		<!-- 配送计划弹窗 -->
		<PlanWindow  v-on:changeFun="changeFun" :attr="attr" ></PlanWindow>
		<!-- 停止配送 -->
		<l-modal ref="customModal" modalTitle="请输入起送日期" @onClickCancel="cancel" @onClickConfirm="confirm"></l-modal>
	</view>
</template>
<script>
import { getYsOrderList, setPoject,stopPojectOd } from '@/api/order';
import { cancelOrderHandle, payOrderHandle, takeOrderHandle } from '@/libs/order';
import Loading from '@/components/Loading';
import Payment from '@/components/Payment';
import DataFormat from '@/components/DataFormat';
import { mapGetters } from 'vuex';
import { isWeixin, dataFormat } from '@/utils';
import PlanWindow from '@/components/PlanWindow'
import lModal from '@/components/dialogBox'
const STATUS = ['待付款', '待发货', '待收货', '待评价', '已完成', '', '', '', '', '待付款'];

const NAME = 'MyOrder';
let timer;
export default {
	name: NAME,
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
		Payment,
		PlanWindow,
		lModal,
		DataFormat
	},
	computed: mapGetters(['userInfo']),
	onShow: function() {
		this.type = parseInt(this.$yroute.query.type) || 5;
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
		 this.getOrderList();
		 if (typeof opt !== 'object') opt = {}
		 let action = opt.action || ''
		 let value = opt.value === undefined ? '' : opt.value
		 this.attr.cartAttr = value
		 this[action] && this[action](value)
		},
		getPlan(cart,order){
			this.attr.cartAttr = true 
			this.attr.cart = cart
			this.attr.orderId = order.orderId
			this.attr.totalNum = order.totalNum
		},
		stopPlan(cart,order){
			this.stopParams = {
				cart: cart,
				order: order
			}
			this.$refs['customModal'].showModal()
		},
		planDetail(order){
			/* return uni.showToast({
				title: '该功能尚未完善',
				icon: 'none',
				duration: 2000
			}); */
			this.$yrouter.push({
				path: '/pages/order/Distribution/detail',
				query: { id: order.orderId }
			});
		},
		cancel(val){
			console.log(val) 
		},
		 confirm(val){
			let that = this
			stopPojectOd({orderId: this.stopParams.order.orderId,startDate: val, productId: this.stopParams.cart.productId}).then(res => {
				uni.showToast({
					title: res.msg,
					icon: 'none',
					duration: 2000
				});
			});
		 },
		goOrderDetails(order,cart) {
			this.$yrouter.push({
				path: '/pages/order/Distribution/detail',
				query: { orderId: order.orderId, productId: cart.productId }
			});
		},
		dataFormat,
		getOrderList() {
			let that = this
			if (this.loading || this.loaded) return;
			this.loading = true;
			const { page, limit, type } = this;
			getYsOrderList({
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
