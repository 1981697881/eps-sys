<template>
	<view class="order-submission">
		<view class="allAddress" :style="systemStore ? '' : 'padding-top: 0.2*100rpx'">
			<view class="nav acea-row">
				<view class="item font-color-red" :class="shipping_type === 0 ? 'on' : 'on2'" @click="addressType(0)" v-if="systemStore && isExpress"></view>
				<view class="item font-color-red" :class="shipping_type === 1 && isExpress ? 'on' : 'on2'" @click="addressType(1)" v-if="systemStore && !isIntegral && isSelfMention"></view>
			</view>
			<view class="address acea-row row-between-wrapper" v-if="shipping_type === 0" @click="addressTap">
				<view class="addressCon" v-if="addressInfo.realName">
					<view class="name">
						{{ addressInfo.realName }}
						<text class="phone">{{ addressInfo.phone }}</text>
					</view>
					<view>
						<text class="default font-color-red" v-if="addressInfo.isDefault">[默认]</text>
						{{ addressInfo.province }}{{ addressInfo.city }}{{ addressInfo.district }}{{ addressInfo.detail }}
					</view>
				</view>
				<view class="addressCon" v-else><view class="setaddress">设置收货地址</view></view>
				<view class="iconfont icon-jiantou"></view>
			</view>
			<div class="address acea-row row-between-wrapper" v-if="shipping_type === 1" @click="showStoreList">
				<div class="addressCon" v-if="storeItems">
					<div class="name">
						{{ storeItems.name }}
						<span class="phone">{{ storeItems.phone }}</span>
					</div>
					<div>{{ storeItems.address }}</div>
				</div>
				<div class="addressCon" v-else>
					<div class="name">
						{{ systemStore.name }}
						<span class="phone">{{ systemStore.phone }}</span>
					</div>
					<div>{{ systemStore.address }}</div>
				</div>
				<div class="iconfont icon-jiantou"></div>
			</div>
			<view class="line"><image :src="`${$VUE_APP_RESOURCES_URL}/images/line.jpg`" /></view>
		</view>
		<block v-for="(item, index) in orderGroupInfo" :key="index">
			<OrderGoods :evaluate="0" :isIntegral="isIntegral" :cartInfo="item.cartInfo"></OrderGoods>
			<view class="wrapper" style="margin-top: 0;">
				<view class="item acea-row row-between-wrapper" @click="couponTap(item, index)" v-if="item.deduction === false && !isIntegral">
					<view>优惠券</view>
					<view class="discount">
						{{ item.usableCoupon.couponTitle || '请选择' }} {{ item.usableCoupon.couponPrice || '' }}
						<text class="iconfont icon-jiantou"></text>
					</view>
				</view>
				<view class="item acea-row row-between-wrapper" v-if="shipping_type === 0">
					<view>快递费用</view>
					<view class="discount">{{ item.cartPrice.payPostage > 0 ? item.cartPrice.payPostage : '免运费' }}</view>
				</view>
				<view class="item">
					<view>订单备注</view>
					<textarea v-model="mark"></textarea>
				</view>
				<view class="totalPrice" v-if="!isIntegral">
					共{{ item.cartInfo.length || 0 }}件商品，小计 <!-- 原价 优惠价 ￥{{ item.cartPrice.payPrice || 0 }} -->
					<text class="money font-color-red">￥{{ item.priceGroup.totalPrice || 0 }} </text>
				</view>
			</view>
		</block>
		<view class="wrapper">
			<!-- && item.deduction === false -->
			<view v-if="shipping_type === 1">
				<view class="item acea-row row-between-wrapper">
					<view>联系人</view>
					<view class="discount"><input type="text" placeholder="请填写您的联系姓名" v-model="contacts" /></view>
				</view>
				<view class="item acea-row row-between-wrapper">
					<view>联系电话</view>
					<view class="discount"><input type="text" placeholder="请填写您的联系电话" v-model="contactsTel" /></view>
				</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="!isIntegral && enableIntegral === true">
				<view>积分抵扣</view>
				<view class="discount">
					<view class="select-btn">
						<view class="checkbox-wrapper">
							<!-- <input type="checkbox" v-model="useIntegral" @click="changeUseIntegral"/> -->
							<checkbox-group @change="changeUseIntegral">
								<label class="well-check">
									<text class="integral">
										当前积分
										<text class="num font-color-red">{{ userInfo.integral || 0 }}</text>
									</text>
									<checkbox value="true" :checked="useIntegral ? true : false"></checkbox>
								</label>
							</checkbox-group>
						</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view>支付方式</view>
				<view class="list">
					<view class="payItem acea-row row-middle" v-if="!isIntegral" :class="active === 'weixin' ? 'on' : ''" @click="payItem('weixin')" v-show="isWeixin">
						<view class="name acea-row row-center-wrapper">
							<view class="iconfont icon-weixin2" :class="active === 'weixin' ? 'bounceIn' : ''"></view>
							微信支付
						</view>
						<view class="tip">微信快捷支付</view>
					</view>
					<view class="payItem acea-row row-middle" v-if="!isIntegral" :class="active === 'weixin' ? 'on' : ''" @click="payItem('weixin')" v-show="!isWeixin">
						<view class="name acea-row row-center-wrapper">
							<view class="iconfont icon-weixin2" :class="active === 'weixin' ? 'bounceIn' : ''"></view>
							微信支付
						</view>
						<view class="tip">微信快捷支付</view>
					</view>
					<view class="payItem acea-row row-middle" v-if="!isIntegral" :class="active === 'yue' ? 'on' : ''" @click="payItem('yue')">
						<view class="name acea-row row-center-wrapper">
							<view class="iconfont icon-icon-test" :class="active === 'yue' ? 'bounceIn' : ''"></view>
							余额支付
						</view>
						<view class="tip">可用余额：{{ userInfo.nowMoney || 0 }}</view>
					</view>
					<view class="payItem acea-row row-middle" v-if="isIntegral" :class="active === 'integral' ? 'on' : ''" @click="payItem('integral')">
						<view class="name acea-row row-center-wrapper">
							<view class="iconfont icon-icon-test" :class="active === 'integral' ? 'bounceIn' : ''"></view>
							积分支付
						</view>
						<view class="tip">可用积分：{{ userInfo.integral || 0 }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="moneyList">
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.totalPrice !== undefined">
				<view>商品总价：</view>
				<view class="money" v-if="!isIntegral">￥{{ filterNumber(orderPrice.totalPrice) }}</view>
				<view class="money" v-if="isIntegral">{{ filterNumber(orderPrice.payIntegral) }}积分</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.payPostage > 0 && !isIntegral">
				<view>运费：</view>
				<view class="money">￥{{ filterNumber(orderPrice.payPostage) }}</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.couponPrice > 0 && !isIntegral">
				<view>优惠券抵扣：</view>
				<view class="money">-￥{{ filterNumber(orderPrice.couponPrice) }}</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.deductionPrice > 0 && !isIntegral">
				<view>积分抵扣：</view>
				<view class="money">-￥{{ filterNumber(orderPrice.deductionPrice) }}</view>
			</view>
		</view>
		<view style="height: 120rpx"></view>
		<view class="footer acea-row row-between-wrapper">
			<view>
				合计:
				<text class="font-color-red" v-if="!isIntegral">￥{{ filterNumber(orderPrice.payPrice) }}</text>
				<text class="font-color-red" v-if="isIntegral">{{ filterNumber(orderPrice.payIntegral) }}积分</text>
			</view>
			<view class="settlement" @click="createOrder">立即结算</view>
		</view>
		<CouponListWindow
			v-on:couponchange="changecoupon($event)"
			v-model="showCoupon"
			:price="orderPrice.totalPrice"
			:index="usableCoupon.index"
			:checked="usableCoupon.item.id"
			@checked="changeCoupon"
			:cartid="couponCartid"
		></CouponListWindow>
		<AddressWindow @checked="changeAddress" @redirect="addressRedirect" v-model="showAddress" :checked="addressInfo.id" ref="mychild"></AddressWindow>
	</view>
</template>
<script>
import CouponListWindow from '@/components/CouponListWindow';
import AddressWindow from '@/components/AddressWindow';
import { postOrderConfirm, postOrderComputed, createOrder } from '@/api/order';
import { mapGetters } from 'vuex';
import { handleOrderPayResults, subscribeMessage } from '@/libs/order';
import { weappPay } from '@/libs/wechat';
import { isWeixin, handleErrorMessage } from '@/utils';
import OrderGoods from '@/components/OrderGoods.vue';
const NAME = 'OrderSubmission',
	_isWeixin = isWeixin();
export default {
	name: NAME,
	components: {
		OrderGoods,
		CouponListWindow,
		AddressWindow
	},
	props: {},
	data: function() {
		return {
			offlinePayStatus: 2,
			from: this.$deviceType,
			deduction: true,
			enableIntegral: true,
			enableIntegralNum: 0,
			isWeixin: _isWeixin,
			pinkId: 0,
			active: 'weixin',/* _isWeixin ? 'weixin' : 'yue' */
			showCoupon: false,
			isSelfMention: true,
			isExpress: true,
			showAddress: false,
			addressInfo: {},
			couponId: 0,
			orderGroupInfo: [],
			usableCoupon: {},
			addressLoaded: false,
			useIntegral: false,
			orderPrice: {
				payPrice: '计算中'
			},	
			mark: '',
			cartPrice: [],
			couponCartid: '',
			systemStore: {},
			isNo: 0,
			shipping_type: 0,
			contacts: '',
			contactsTel: '',
			storeSelfMention: 0,
			cartid: [],
			isIntegral: false
		};
	},
	computed: mapGetters(['userInfo', 'storeItems']),
	watch: {
		cartPrice(n) {
			n.forEach((item, index) => {
				for (var pl in item) {
					//数组对象遍历
					if (index == 0) {
						this.orderPrice[pl] = parseFloat(item[pl]);
					} else {
						this.orderPrice[pl] = this.numAdd(this.orderPrice[pl], item[pl]);
					}
				}
			});
		},
		useIntegral() {
			if (this.orderGroupInfo.length > 0) {
				this.orderGroupInfo.forEach(item => {
					this.computedPrice(item);
				});
			}
			console.log(this.cartPrice)
			/* this.computedPrice(); */
		},
		$yroute(n) {
			if (n.name === NAME) this.getCartInfo();
		},
		shipping_type() {
			this.orderGroupInfo.forEach(item => {
				this.computedPrice(item);
			});
		}
	},
	onLoad: function() {
		let that = this;
		this.$store.dispatch('getUser', true);
		if (that.$yroute.query.pinkid !== undefined) {
			that.pinkId = that.$yroute.query.pinkid;
		}
		if(that.$yroute.query.isSelfMention){
			if(that.$yroute.query.isSelfMention == "true"){
				that.isSelfMention = true
			}else{
				that.isSelfMention = false
			}
			if(that.$yroute.query.isExpress == "true"){
				that.isExpress = true
			}else{
				that.isExpress = false
			}
		}
		if(that.isExpress == true){
			that.shipping_type = 0
		}else{
			that.shipping_type = 1
		}
		if(that.$yroute.query.payType){
			if(that.$yroute.query.payType == 'extreme'){
				this.isNo = 0
			}else{
				this.isNo = 1
			}
		}
		that.getCartInfo();
		this.isIntegral = that.$yroute.query.isIntegral == 'true';
		this.useIntegral = this.isIntegral;
		if (this.isIntegral) {
			this.active = 'integral';
		}
		if (that.$yroute.query.id !== undefined) {
			that.cartid = JSON.parse(that.$yroute.query.id);
		}
	},
	methods: {
		numAdd(num1, num2) {
			let baseNum, baseNum1, baseNum2;
			try {
				baseNum1 = num1.toString().split('.')[1].length;
			} catch (e) {
				baseNum1 = 0;
			}
			try {
				baseNum2 = num2.toString().split('.')[1].length;
			} catch (e) {
				baseNum2 = 0;
			}
			baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
			return (num1 * baseNum + num2 * baseNum) / baseNum;
		},
		filterNumber(value) {
			let num = value;
			if (num.toString().split('.').length == 1) {
				return num + '.00';
			} else {
				if (
					num
						.toString()
						.split('.')[1]
						.toString().length == 1
				) {
					return num + '0';
				} else {
					return num + '';
				}
			}
		},
		showStoreList() {
			this.$store.commit('get_to', 'orders');
			this.$yrouter.push({
				path: '/pages/shop/StoreList/index'
			});
		},
		addressType: function(index) {
			if (index && !this.systemStore.id) {
				uni.showToast({
					title: '暂无门店信息，您无法选择到店自提！',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			this.shipping_type = index;
		},
		changeUseIntegral: function(e) {
			// this.computedPrice();
			if (this.isIntegral) {
				return;
			}
			this.useIntegral = e.mp.detail.value[0];
		},
		computedPrice(params) {
			this.cartPrice = [];
			let shipping_type = this.shipping_type;
			postOrderComputed(params.orderKey, {
				addressId: this.addressInfo.id || '',
				useIntegral: this.useIntegral ? 1 : 0,
				isNo: this.isNo,
				couponId: params.usableCoupon != null ? params.usableCoupon.id : 0,
				shipping_type: parseInt(shipping_type) + 1
			}).then(res => {
				const data = res.data;
				if (data.status === 'EXTEND_ORDER') {
					this.$yrouter.replace({
						path: '/pages/order/OrderDetails/index',
						query: {
							id: data.result.orderId
						}
					});
				} else {
					params.cartPrice = data.result
					this.cartPrice.push(data.result);
				}
			});
		},
		getCartInfo() {
			const cartIds = JSON.parse(this.$yroute.query.id);
			if (!cartIds) {
				uni.showToast({
					title: '参数有误',
					icon: 'none',
					duration: 2000
				});
				return this.$yrouter.back();
			}
			let cartid = '';
			cartIds.forEach((item, index) => {
				cartid += item.join(',');
				if (cartIds.length != index + 1) {
					cartid = cartid + ',';
				}
			});
			postOrderConfirm(cartid,this.isNo)
				.then(res => {
					this.offlinePayStatus = res.data.offline_pay_status;
					this.orderGroupInfo = res.data;
					/* this.deduction = res.data.deduction; */
					/* this.usableCoupon = res.data.usableCoupon || {}; */
					this.addressInfo = res.data[0].addressInfo || {};
					// 用来显示到店自提的店铺地址
					this.systemStore = res.data[0].systemStore || {};
					this.storeSelfMention = res.data[0].storeSelfMention;
					let data = [...res.data];
					data.forEach(item => {
						this.computedPrice(item);
					});
					console.log(data)
				})
				.catch(() => {
					uni.showToast({
						title: '加载订单数据失败',
						icon: 'none',
						duration: 2000
					});
				});
		},
		addressTap: function() {
			this.showAddress = true;
			if (!this.addressLoaded) {
				this.addressLoaded = true;
				this.$refs.mychild.getAddressList();
			}
		},
		addressRedirect() {
			this.addressLoaded = false;
			this.showAddress = false;
		},
		couponTap: function(item, index) {
			this.showCoupon = true;
			this.usableCoupon = {
				item: item.usableCoupon,
				index: index
			};
			this.couponCartid = this.cartid[index].toString();
		},
		changeCoupon: function(coupon) {
			if (!coupon.item) {
				this.usableCoupon = {
					couponTitle: '不使用优惠券',
					id: 0
				};
			} else {
				this.usableCoupon = coupon.item;
			}
			this.orderGroupInfo[coupon.index].usableCoupon = this.usableCoupon;
			this.orderGroupInfo.forEach(item => {
				this.computedPrice(item);
			});
		},
		payItem: function(index) {
			this.active = index;
		},
		changeAddress(addressInfo) {
			this.addressInfo = addressInfo;
			this.orderGroupInfo.forEach(item => {
				this.computedPrice(item);
			});
		},
		createOrder() {
			let that = this;
			if (this.isIntegral) {
				// 积分支付
				if (this.userInfo.integral < this.orderPrice.payIntegral) {
					uni.showToast({
						title: '积分不足',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				this.active = 'integral';
			}
			let shipping_type = this.shipping_type;
			if (!this.isIntegral && !this.active) {
				uni.showToast({
					title: '请选择支付方式',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			if (!this.addressInfo.id && !this.shipping_type) {
				uni.showToast({
					title: '请选择收货地址',
					icon: 'none',
					duration: 2000
				});
				return;
			}

			if (this.shipping_type) {
				if ((this.contacts === '' || this.contactsTel === '') && this.shipping_type) {
					uni.showToast({
						title: '请填写联系人或联系人电话',
						icon: 'none',
						duration: 2000
					});
					return;
				}

				if (!/^1(3|4|5|7|8|9|6)\d{9}$/.test(this.contactsTel)) {
					uni.showToast({
						title: '请填写正确的手机号',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (!/^[\u4e00-\u9fa5\w]{2,16}$/.test(this.contacts)) {
					uni.showToast({
						title: '请填写您的真实姓名',
						icon: 'none',
						duration: 2000
					});
					return;
				}
			}

			uni.showLoading({
				title: '生成订单中'
			});
			let from = {};
			if (this.$deviceType == 'app') {
				from.from = 'app';
			}
			// #ifdef MP-WEIXIN
			/* subscribeMessage(); */
			// #endif
			let params = [];
			this.orderGroupInfo.forEach((item, index) => {
				let obj = {
					key: item.orderKey,
					allPayPrice: that.orderPrice.payPrice,
					jisuda: item.cartInfo[0].productInfo.isIntegral==3?1:0,
					yushou: item.cartInfo[0].productInfo.isIntegral==2?1:0,
					param: {
						realName: that.contacts,
						phone: that.contactsTel,
						addressId: that.addressInfo.id,
						useIntegral: that.useIntegral ? 1 : 0,
						couponId: item.usableCoupon != null ? item.usableCoupon.id : 0,
						payType: that.active,
						pinkId: that.pinkId,
						seckillId: item.seckill_id,
						combinationId: item.combination_id,
						bargainId: item.bargain_id,
						from: that.from,
						mark: that.mark || '',
						shippingType: parseInt(shipping_type) + 1,
						storeId: that.storeItems ? that.storeItems.id : that.systemStore.id,
						...from
					}
				};
				params.push(obj)
			});
			createOrder(params)
				.then(res => {
					uni.hideLoading();
					let isPreSale = false
					this.orderGroupInfo.forEach((item)=>{
						item.cartInfo.forEach((cart)=>{
							if(cart.productInfo.isIntegral == 2){
								isPreSale = true
							}
						})
					})
					if(this.orderGroupInfo.length>1){
						handleOrderPayResults.call(this, res.data.goPayList, 'create', this.active,isPreSale);
					}else{
						handleOrderPayResults.call(this, res.data, 'create', this.active,isPreSale);
					}
				})
				.catch(err => {
					handleErrorMessage(err, '创建订单失败');
				});
		}
	}
};
</script>
<style scoped lang="less">
.totalPrice {
	height: 70rpx;
	line-height: 70rpx;
	width: 100%;
	text-align: right;
	padding-right: 20rpx;
}
.order-submission .wrapper .shipping select {
	color: #999;
	padding-right: 0.15 * 100rpx;
}

.order-submission .wrapper .shipping .iconfont {
	font-size: 0.3 * 100rpx;
	color: #515151;
}

.order-submission .allAddress {
	width: 100%;
	background-image: linear-gradient(to bottom, #eb3729 0%, #eb3729 100%);
	background-image: -webkit-linear-gradient(to bottom, #eb3729 0%, #eb3729 100%);
	background-image: -moz-linear-gradient(to bottom, #eb3729 0%, #eb3729 100%);
	padding-top: 1 * 100rpx;
}

.order-submission .allAddress .nav {
	margin: 0 auto;
	padding: 0 30rpx;
	width: 100%;
	box-sizing: border-box;
}

.order-submission .allAddress .nav .item {
	flex: 1;
	position: relative;
}

.order-submission .allAddress .nav .item.on {
	position: relative;
}

.order-submission .allAddress .nav .item.on:before {
	position: absolute;
	bottom: 0;
	content: '快递配送';
	font-size: 0.28 * 100rpx;
	display: block;
	height: 0;
	left: 0;
	right: 0;
	border-width: 0.4 * 100rpx;
	border-style: solid;
	border-color: #fff;
	z-index: 9;
	text-align: center;
	line-height: 0.14 * 100rpx;
}

/* .order-submission .allAddress .nav .item:nth-of-type(2).on:before {
	content: '到店自提';
	border-width: 0.4 * 100rpx;
} */

.order-submission .allAddress .nav .item.on2 {
	position: relative;
}

.order-submission .allAddress .nav .item.on2:before {
	position: absolute;
	bottom: 0;
	content: '到店自提';
	font-size: 0.28 * 100rpx;
	display: block;
	height: 0;
	left: 0;
	right: 0;
	border-width: 0.4 * 100rpx;
	border-style: solid;
	border-color: #d5e6e6;
	text-align: center;
	line-height: 0.14 * 100rpx;
}

/* .order-submission .allAddress .nav .item:nth-of-type(1).on2:before {
	content: '快递配送';
	border-width: 0.4 * 100rpx;
} */

.order-submission .allAddress .address {
	width: 6.91 * 100rpx;
	height: 1.5 * 100rpx;
	margin: 0 auto;
	box-sizing: border-box;
}

.order-submission .allAddress .line {
	width: 7.1 * 100rpx;
	margin: 0 auto;
}

.order-submission .wrapper .item .discount input::placeholder {
	color: #ccc;
}
</style>
