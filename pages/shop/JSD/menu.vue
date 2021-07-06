<template>
	<view class="container" v-if="!loading">
		<view class="main" v-if="goods.length">
			<view class="nav">
				<view class="coupon">
					<text class="title">两小时内配送上门，赶紧去购买</text>
					<view class="iconfont iconarrow-right"></view>
				</view>
			</view>
			<view class="content">
				<scroll-view class="menus" :scroll-into-view="menuScrollIntoView" scroll-with-animation scroll-y>
					<view class="wrapper">
						<view
							class="menu"
							:id="`menu-${item.categoryId}`"
							:class="{ current: item.categoryId === currentCateId }"
							v-for="(item, index) in goods"
							:key="index"
							@tap="handleMenuTap(item.categoryId)"
						>
							<text>{{ item.cateName }}</text>
							<view class="dot" v-show="menuCartNum(item.categoryId)">{{ menuCartNum(item.categoryId) }}</view>
						</view>
					</view>
				</scroll-view>
				<!-- goods list begin -->
				<scroll-view class="goods" scroll-with-animation scroll-y :scroll-top="cateScrollTop" @scroll="handleGoodsScroll">
					<view class="wrapper">
						<view id="ads"></view>
						<!-- <swiper class="ads" id="ads" autoplay :interval="3000" indicator-dots>
							<swiper-item v-for="(item, index) in ads" :key='index'>
								<image :src="item.image"></image>
							</swiper-item>
						</swiper> -->
						<view class="list">
							<!-- category begin -->
							<view class="category" v-for="(item, index) in goods" :key="index" :id="`cate-${item.categoryId}`">
								<view class="title">
									<text>{{ item.cateName }}</text>
									<image :src="item.icon" class="icon"></image>
								</view>
								<view class="items">
									<!-- 商品 begin -->
									<view class="good" v-for="(good, key) in item.yxStoreProductVo" :key="key">
										<image :src="good.image" class="image" @tap="showGoodDetailModal(item, good)"></image>
										<view class="right">
											<text class="name">{{ good.storeName }}</text>
											<text class="tips">{{ good.storeInfo }}</text>
											<view class="price_and_action">
												<text class="price">￥{{ good.price }}</text>
												<view class="btn-group" v-if="good.productAttr.length > 0">
													<button type="primary" class="btn property_btn" hover-class="none" size="mini" @tap="showGoodDetailModal(item, good)">
														选规格
													</button>
													<view class="dot" v-show="goodCartNum(good.id)">{{ goodCartNum(good.id) }}</view>
												</view>
												<view class="btn-group" v-else>
													<button
														type="default"
														v-show="goodCartNum(good.id)"
														plain
														class="btn reduce_btn"
														size="mini"
														hover-class="none"
														@tap="handleReduceFromCart(item, good)"
													>
														<view class="iconfont iconsami-select"></view>
													</button>
													<view class="number" v-show="goodCartNum(good.id)">{{ goodCartNum(good.id) }}</view>
													<button type="primary" class="btn add_btn" size="min" hover-class="none" @tap="handleAddToCart(item, good, 1)">
														<view class="iconfont iconadd-select"></view>
													</button>
												</view>
											</view>
										</view>
									</view>
									<!-- 商品 end -->
								</view>
							</view>
							<!-- category end -->
						</view>
					</view>
				</scroll-view>
				<!-- goods list end -->
			</view>
			<!-- content end -->
			<!-- 购物车栏 begin -->
			<view class="cart-box" v-if="cart.length > 0">
				<view class="mark">
					<image src="/static/images/menu/cart.png" class="cart-img" @tap="openCartPopup"></image>
					<view class="tag">{{ getCartGoodsNumber }}</view>
				</view>
				<view class="price">￥{{ getCartGoodsPrice }}</view>
				<button type="primary" class="pay-btn" @tap="toPay" :disabled="disabledPay">{{ disabledPay ? `差${spread}元起送` : '去结算' }}</button>
			</view>
			<!-- 购物车栏 end -->
		</view>
		<!-- 商品详情模态框 begin -->
		<modal :show="goodDetailModalVisible" class="good-detail-modal" color="#5A5B5C" width="90%" custom padding="0rpx" radius="12rpx">
			<view class="cover">
				<image v-if="good.image" :src="good.image" class="image"></image>
				<view class="btn-group">
					<image src="/static/images/menu/share-good.png"></image>
					<image src="/static/images/menu/close.png" @tap="closeGoodDetailModal"></image>
				</view>
			</view>
			<scroll-view class="detail" scroll-y>
				<view class="wrapper">
					<view class="basic">
						<view class="name">{{ good.storeName }}</view>
						<view class="tips">{{ good.storeInfo }}</view>
					</view>
					<view class="properties" v-if="good.productAttr">
						<view class="property" v-for="(item, index) in good.productAttr" :key="index">
							<view class="title">
								<text class="name">{{ item.attrName }}</text>
								<view class="desc" v-if="item.desc">({{ item.desc }})</view>
							</view>
							<view class="values">
								<view class="value" v-for="(value, key) in item.attrValue" :key="key" :class="{ default: value.check }" @tap="changePropertyDefault(index, key)">
									{{ value.attr }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="action">
				<view class="left">
					<view class="price">￥{{ getGoodSelectedPrice(good) }}</view>
					<view class="props" v-if="getGoodSelectedProps(good)">{{ getGoodSelectedProps(good) }}</view>
				</view>
				<view class="btn-group">
					<button type="default" plain class="btn" size="mini" hover-class="none" @tap="handlePropertyReduce"><view class="iconfont iconsami-select"></view></button>
					<view class="number">{{ good.number }}</view>
					<button type="primary" class="btn" size="min" hover-class="none" @tap="handlePropertyAdd"><view class="iconfont iconadd-select"></view></button>
				</view>
			</view>
			<view class="add-to-cart-btn" @tap="handleAddToCartInModal"><view>加入购物车</view></view>
		</modal>
		<!-- 商品详情模态框 end -->
		<!-- 购物车详情popup -->
		<popup-layer direction="top" :show-pop="cartPopupVisible" class="cart-popup">
			<template slot="content">
				<view class="top"><text @tap="handleCartClear">清空</text></view>
				<scroll-view class="cart-list" scroll-y>
					<view class="wrapper">
						<view class="item" v-for="(item, index) in cart" :key="index">
							<view class="left">
								<view class="name">{{ item.storeName }}</view>
								<view class="props">{{ item.props_text }}</view>
							</view>
							<view class="center">
								<text>￥{{ item.price }}</text>
							</view>
							<view class="right">
								<button type="default" plain size="mini" class="btn" hover-class="none" @tap="handleCartItemReduce(index)">
									<view class="iconfont iconsami-select"></view>
								</button>
								<view class="number">{{ item.number }}</view>
								<button type="primary" class="btn" size="min" hover-class="none" @tap="handleCartItemAdd(index)">
									<view class="iconfont iconadd-select"></view>
								</button>
							</view>
						</view>
						<view class="item" v-if="orderType == 'takeout' && store.packing_fee">
							<view class="left"><view class="name">包装费</view></view>
							<view class="center">
								<text>￥{{ parseFloat(store.packing_fee) }}</text>
							</view>
							<view class="right invisible">
								<button type="default" plain size="mini" class="btn" hover-class="none"><view class="iconfont iconsami-select"></view></button>
								<view class="number">1</view>
								<button type="primary" class="btn" size="min" hover-class="none"><view class="iconfont iconadd-select"></view></button>
							</view>
						</view>
					</view>
				</scroll-view>
			</template>
		</popup-layer>
		<!-- 购物车详情popup -->
	</view>
	<view class="loading" v-else><image src="/static/images/loading.gif"></image></view>
</template>

<script>
import modal from '@/components/modal/modal';
import popupLayer from '@/components/popup-layer/popup-layer';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import moreGoodList from '@/api/goods.json';
import { getJSDProducts } from '@/api/store';
export default {
	components: {
		modal,
		popupLayer
	},
	data() {
		return {
			goods: [], //所有商品
			ads: [{ image: '' }, { image: '' }],
			where: {
				page: 1,
				limit: 250,
				keyword: '',
				news: 0,
				priceOrder: '',
				isIntegral: 2,
				salesOrder: ''
			},
			loading: true,
			currentCateId: 0, //默认分类
			cateScrollTop: 0,
			menuScrollIntoView: '',
			cart: [], //购物车
			goodDetailModalVisible: false, //是否饮品详情模态框
			good: {}, //当前饮品
			category: {}, //当前饮品所在分类
			cartPopupVisible: false,
			sizeCalcState: false
		};
	},
	async onLoad() {
		await this.init();
	},
	computed: {
		...mapState(['orderType', 'address', 'store']),
		...mapGetters(['isLogin']),
		goodCartNum() {
			//计算单个饮品添加到购物车的数量
			return id =>
				this.cart.reduce((acc, cur) => {
					if (cur.id === id) {
						return (acc += cur.number);
					}
					return acc;
				}, 0);
		},
		menuCartNum() {
			return id =>
				this.cart.reduce((acc, cur) => {
					if (cur.cate_id === id) {
						return (acc += cur.number);
					}
					return acc;
				}, 0);
		},
		getCartGoodsNumber() {
			//计算购物车总数
			return this.cart.reduce((acc, cur) => acc + cur.number, 0);
		},
		getCartGoodsPrice() {
			//计算购物车总价
			return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0);
		},
		disabledPay() {
			//是否达到起送价
			return this.orderType == 'takeout' && this.getCartGoodsPrice < this.store.min_price ? true : false;
		},
		spread() {
			//差多少元起送
			if (this.orderType != 'takeout') return;
			return parseFloat((this.store.min_price - this.getCartGoodsPrice).toFixed(2));
		}
	},
	methods: {
		async init() {
			//页面初始化
			this.loading = true;
			/* this.goods = moreGoodList.data
			this.loading = false */
			this.getProductList();
		},
		getProductList() {
			var that = this;
			let q = that.where;
			getJSDProducts({}).then(res => {
				if (res.success) {
					this.goods = res.data;
					this.currentCateId = res.data[0].categoryId;
					this.loading = false;
					this.cart = uni.getStorageSync('cart') || [];
				}
			});
		},
		takout() {
			if (this.orderType == 'takeout') return;
			if (!this.isLogin) {
				uni.navigateTo({ url: '/pages/login/login' });
				return;
			}
			uni.navigateTo({
				url: '/pages/address/address?is_choose=true'
			});
		},
		handleMenuTap(id) {
			//点击菜单项事件
			if (!this.sizeCalcState) {
				this.calcSize();
			}
			this.currentCateId = id;
			this.$nextTick(() => (this.cateScrollTop = this.goods.find(item => item.categoryId == id).top));
		},
		handleGoodsScroll({ detail }) {
			//商品列表滚动事件
			if (!this.sizeCalcState) {
				this.calcSize();
			}
			const { scrollTop } = detail;
			let tabs = this.goods.filter(item => item.top <= scrollTop).reverse();
			if (tabs.length > 0) {
				this.currentCateId = tabs[0].categoryId;
			}
		},
		calcSize() {
			let h = 10;
			let view = uni.createSelectorQuery().select('#ads');
			view.fields(
				{
					size: true
				},
				data => {
					h += Math.floor(data.height);
				}
			).exec();

			this.goods.forEach(item => {
				let view = uni.createSelectorQuery().select(`#cate-${item.categoryId}`);
				view.fields(
					{
						size: true
					},
					data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}
				).exec();
			});
			this.sizeCalcState = true;
		},
		handleAddToCart(cate, good, num) {
			//添加到购物车
			let price = good.price;
			let that = this;
			if (good.productAttr.length > 0) {
				price = that.getGoodSelectedPrice(good);
			}
			const index = this.cart.findIndex(item => {
				if (good.productAttr.length > 0) {
					return item.id === good.id && item.props_text === good.props_text;
				} else {
					return item.id === good.id;
				}
			});
			if (index > -1) {
				this.cart[index].number += num;
			} else {
				this.cart.push({
					id: good.id,
					cate_id: cate.id,
					storeName: good.storeName,
					price: price,
					number: num,
					image: good.images,
					storeInfo: good.storeInfo,
					props_text: good.props_text,
					props: good.props
				});
			}
		},
		handleReduceFromCart(item, good) {
			const index = this.cart.findIndex(item => item.id === good.id);
			this.cart[index].number -= 1;
			if (this.cart[index].number <= 0) {
				this.cart.splice(index, 1);
			}
		},
		showGoodDetailModal(item, good) {
			this.DefaultSelect(good);
			this.good = JSON.parse(JSON.stringify({ ...good, number: 1 }));
			this.category = JSON.parse(JSON.stringify(item));
			this.goodDetailModalVisible = true;
		},
		//默认选中属性；
		DefaultSelect: function(good) {
			let productAttr = good.productAttr;
			let value = [];
			for (let i = 0; i < productAttr.length; i++) {
				this.$set(productAttr[i].attrValue[0], 'check', true);
			}
		},
		closeGoodDetailModal() {
			//关闭饮品详情模态框
			this.goodDetailModalVisible = false;
			this.category = {};
			this.good = {};
		},
		changePropertyDefault(index, key) {
			//改变默认属性值
			this.good.productAttr[index].attrValue.forEach(value => this.$set(value, 'check', false));
			this.good.productAttr[index].attrValue[key].check = true;
			this.good.number = 1;
		},
		getGoodSelectedPrice(good) {
			let price = '';
			if (good.id) {
				let value = this.getGoodSelectedProps(good);
				good.productValue.forEach((item, index) => {
					if (item.sku == value) {
						price = item.price;
					}
				});
			}
			return price;
		},
		getGoodSelectedProps(good, type = 'text') {
			//计算当前饮品所选属性
			if (good.productAttr && good.productAttr.length > 0) {
				let props = [];
				good.productAttr.forEach(({ attrValue }) => {
					attrValue.forEach(value => {
						if (value.check) {
							props.push(type === 'text' ? value.attr : value.attr);
						}
					});
				});
				return type === 'text' ? props.join(',') : props;
			}
			return '';
		},
		handlePropertyAdd() {
			this.good.number += 1;
		},
		handlePropertyReduce() {
			if (this.good.number === 1) return;
			this.good.number -= 1;
		},
		handleAddToCartInModal() {
			const product = Object.assign({}, this.good, { props_text: this.getGoodSelectedProps(this.good), props: this.getGoodSelectedProps(this.good, 'id') });
			this.handleAddToCart(this.category, product, this.good.number);
			this.closeGoodDetailModal();
		},
		openCartPopup() {
			//打开/关闭购物车列表popup
			this.cartPopupVisible = !this.cartPopupVisible;
		},
		handleCartClear() {
			//清空购物车
			uni.showModal({
				title: '提示',
				content: '确定清空购物车么',
				success: ({ confirm }) => {
					if (confirm) {
						this.cartPopupVisible = false;
						this.cart = [];
					}
				}
			});
		},
		handleCartItemAdd(index) {
			this.cart[index].number += 1;
		},
		handleCartItemReduce(index) {
			if (this.cart[index].number === 1) {
				this.cart.splice(index, 1);
			} else {
				this.cart[index].number -= 1;
			}
			if (!this.cart.length) {
				this.cartPopupVisible = false;
			}
		},
		toPay() {
			if (!this.isLogin) {
				uni.navigateTo({ url: '/pages/login/login' });
				return;
			}
			uni.showLoading({ title: '加载中' });
			console.log(JSON.parse(JSON.stringify(this.cart)));
			uni.setStorageSync('cart', JSON.parse(JSON.stringify(this.cart)));
			uni.navigateTo({
				url: '/pages/pay/pay'
			});
			uni.hideLoading();
		}
	}
};
</script>
<style lang="scss" scoped>
@import '~@/pages/shop/JSD/menu.scss';
.nav {
	height: 100rpx;
}
</style>
