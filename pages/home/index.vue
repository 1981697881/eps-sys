<template>
	<view class="index">
		<view v-for="(item, index) in homeData" :key="index">
			<view class="head_box" v-if="item.type == 'header'" :style="{ background: bgcolor }" :class="{ active: bgcolor }">
				<cu-custom :isBack="true" :bgColor="bgcolor">
					<block slot="backText">
						<text class="nav-title shopro-selector-rect">心水达会员店</text>
						<!-- {{ item.componentContent.title }} -->
					</block>
				</cu-custom>
			</view>
			<view class="header header-search acea-row row-center-wrapper" v-if="item.type == 'search'" :style="{ background: bgcolor }">
				<view @click="goGoodSearch()" class="search acea-row row-middle">
					<text class="iconfont icon-xiazai5"></text>
					搜索商品
				</view>
				<view class="qr" @click="startQr()">
					<!-- <text class="lg text-gray cuIcon-scan" style="font-size:50rpx"></text> -->
					<image :src="`${$VUE_APP_RESOURCES_URL}/images/qr.png`" />
				</view>
			</view>
			<Banner v-if="item.type == 'banner'" :detail="banner" @getbgcolor="getbgcolor"></Banner>
			<uni-notice-bar
				v-if="item.type == 'noticeBar'"
				scrollable="true"
				@click="goRoll(roll[0])"
				single="true"
				:speed="10"
				showIcon="true"
				:text="roll[0].info"
			></uni-notice-bar>
			<view class="content_box home_content_box" v-if="item.type == 'menu' && item.componentContent.menus">
				<!-- 菜单 -->
				<Menu :list="menus"></Menu>
			</view>
			<!-- 滚动新闻 -->
			<!-- 广告 -->
			<!-- <Adv v-if="item.type == 'adv' && item.componentContent.detail" :detail="item.componentContent.detail" /> -->
			<!-- <item-container v-if="item.type == 'fullReduction'" :num="itemcontainer3.noswipernum4" :banner="itemcontainer3.banner" :list="itemcontainer3.data1"></item-container> -->
			<!-- 热门榜单 -->
			<HotCommodity v-if="item.type == 'hotCommodity'" :detail="likeInfo"></HotCommodity>
			<!-- 超值拼团 -->
			<Groupon v-if="item.type == 'groupon'" :detail="combinationList" />
			<!-- 首发新品->秒杀 -->
			<FirstNewProduct v-if="item.type == 'firstNewProduct'" :detail="firstList"></FirstNewProduct>
			<!-- 精品推荐 -->
			<ProductsRecommended v-if="item.type == 'productsRecommended'" :detail="bastList"></ProductsRecommended>
			<!-- 促销单品 -->
			<PromoteProduct v-if="item.type == 'promoteProduct'" :detail="benefit"></PromoteProduct>
			<!-- 直播 -->
			<!-- #ifdef MP-WEIXIN -->
			<!-- <Live v-if="item.type == 'live'" :detail="live"></Live> -->
			<!-- #endif -->
			<!-- 为您推荐 -->
			<PromotionGood v-if="item.type == 'promotionGood'" :benefit="benefit"></PromotionGood>
			<Coupon-window :coupon-list="couponList" v-if="showCoupon" @checked="couponClose" @close="couponClose"></Coupon-window>
		</view>
	</view>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import GoodList from '@/components/GoodList';
import PromotionGood from '@/components/PromotionGood';
import CouponWindow from '@/components/CouponWindow';
import Menu from '@/components/Menu';
import UniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar';
import Adv from '@/components/sh-adv';
import Groupon from '@/components/sh-groupon.vue';

import Banner from './components/Banner';
import HotCommodity from './components/HotCommodity';
import FirstNewProduct from './components/FirstNewProduct';
import ProductsRecommended from './components/ProductsRecommended';
/* import Live from './components/Live' */

import { getHomeData, getShare, getCanvas, exchange } from '@/api/public';
import cookie from '@/utils/store/cookie';
import { isWeixin, handleUrlParam } from '@/utils/index';
import itemContainer from '@/components/item-container.vue';
import listMall from '@/components/list-mall.vue';
import { openShareAll } from '@/libs/wechat';
import mockData from '@/api/index.js';
const HAS_COUPON_WINDOW = 'has_coupon_window';

export default {
	name: 'Index',
	components: {
		// swiper,
		// swiperSlide,
		UniNoticeBar,
		GoodList,
		PromotionGood,
		CouponWindow,
		Menu,
		Adv,
		Groupon,
		Banner,
		HotCommodity,
		FirstNewProduct,
		ProductsRecommended,
		itemContainer,
		listMall
		/* Live, */
	},
	props: {},
	data: function() {
		return {
			itemcontainer3: {},
			homeData: [],
			CustomBar: this.CustomBar,
			StatusBar: this.StatusBar,
			formatMenus: [],
			categoryCurrent: 0,
			menuNum: 4,
			bgcolor: '#EEB422',
			bgColor: '#EEB422',
			swiperCurrent: 0, //轮播下标
			webviewId: 0,
			showCoupon: false,
			logoUrl: '',
			banner: [],
			menus: [],
			combinationList: [],
			roll: [],
			activity: [],
			activityOne: {},
			bastList: [],
			firstList: [],
			info: {
				fastList: [],
				bastBanner: [],
				bastList: []
			},
			likeInfo: [],
			roll: [],
			live: [],
			lovely: [],
			benefit: [],
			couponList: [],
			swiperOption: {
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				},
				autoplay: {
					disableOnInteraction: false,
					delay: 2000
				},
				loop: true,
				speed: 1000,
				observer: true,
				observeParents: true
			},
			swiperRoll: {
				direction: 'vertical',
				autoplay: {
					disableOnInteraction: false,
					delay: 2000
				},
				loop: true,
				speed: 1000,
				observer: true,
				observeParents: true
			},
			swiperScroll: {
				freeMode: true,
				freeModeMomentum: false,
				slidesPerView: 'auto',
				observer: true,
				observeParents: true
			},
			swiperBoutique: {
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				},
				autoplay: {
					disableOnInteraction: false,
					delay: 2000
				},
				loop: true,
				speed: 1000,
				observer: true,
				observeParents: true
			},
			swiperProducts: {
				freeMode: true,
				freeModeMomentum: false,
				slidesPerView: 'auto',
				observer: true,
				observeParents: true
			},
			bgImage: ''
		};
	},
	computed: {
		singNew() {
			return this.roll.length > 0 ? this.roll[0] : '你还没添加通知哦！';
		},
		customStyle() {
			var bgImage = this.bgImage;
			// var style = `height:${this.CustomBar}px;padding-top:${0}px;background: ${this.bgcolor}`;
			var style = `height:${this.CustomBar}px;padding-top:${this.StatusBar}px;background: ${this.bgcolor}`;
			if (this.bgImage) {
				style = `${style}background-image:url(${bgImage});`;
			}
			return style;
		}
	},
	onLoad: function(option) {
		if (option.pageType == 'coupon') {
			exchange({ qrCode: option.code }).then(res => {
				if (res.success) {
					uni.showToast({
						title: '兑换成功，请在个人中心优惠券中查看',
						icon: 'none',
						duration: 2000
					});
				}
			});
		}

		this.getLocation();
		let that = this;
		// uni.showLoading({
		//   title: "加载中",
		// });
		this.itemcontainer3 = mockData.itemcontainer3;
		getCanvas()
			.then(res => {})
			.catch(error => {
				this.homeData = JSON.parse(error.data.json);
				this.homeData.splice(6, 0, {
					index: 8,
					type: 'fullReduction'
				});
				this.homeData.forEach((item, index) => {
					item.index = index;
				});
				getHomeData().then(res => {
					that.logoUrl = res.data.logoUrl;
					/* res.data.banner.map(item => (item.bgcolor = item.color || '')) */
					that.$set(that, 'info', res.data.info);
					that.$set(that, 'banner', res.data.banner);
					that.$set(that, 'menus', res.data.menus);
					that.$set(that, 'firstList', res.data.firstList);
					that.$set(that, 'bastList', res.data.bastList);
					that.$set(that, 'likeInfo', res.data.likeInfo);
					that.$set(that, 'live', res.data.liveList);
					that.$set(that, 'lovely', res.data.lovely);
					that.$set(that, 'benefit', res.data.benefit);
					that.$set(that, 'roll', res.data.roll);
					that.$set(that, 'couponList', res.data.couponList);
					that.$set(that, 'combinationList', res.data.combinationList);
					that.$forceUpdate();
					uni.hideLoading();
					that.setOpenShare();
					// that.doColorThief()
				});
			});
	},
	methods: {
		...mapActions(['getLocation']),
		onShareTimeline: function() {
			return {
				title: this.miniHomeRemark,
				imageUrl: this.miniHomeImg,
				path: 'pages/home/index?spread=' + uni.getStorageSync('uid')
			};
		},
		onShareAppMessage: function() {
			return {
				title: this.miniHomeRemark,
				imageUrl: this.miniHomeImg,
				path: 'pages/home/index?spread=' + uni.getStorageSync('uid')
			};
		},
		goRoll(item) {
			if (item.uniapp_url) {
				this.$yrouter.push(item.uniapp_url);
			}
		},
		goGoodSearch() {
			// this.$yrouter.push('/pages/shop/GoodsEvaluate/index');
			this.$yrouter.push('/pages/shop/GoodSearch/index');
		},
		goWxappUrl(item) {
			this.$yrouter.push(item.uniapp_url);
		},
		goHotNewGoods(type) {
			this.$yrouter.push({
				path: '/pages/shop/HotNewGoods/index',
				query: {
					type
				}
			});
		},
		goGoodsCon(item) {
			this.$yrouter.push({
				path: '/pages/shop/GoodsCon/index',
				query: {
					id: item.id
				}
			});
		},
		goGoodsPromotion() {
			this.$yrouter.push('/pages/shop/GoodsPromotion/index');
		},
		setOpenShare: function() {
			if (this.$deviceType == 'weixin') {
				getShare().then(res => {
					var data = res.data.data;
					var configAppMessage = {
						desc: data.synopsis,
						title: data.title,
						link: location.href,
						imgUrl: data.img
					};
					openShareAll(configAppMessage);
				});
			}
		},
		startQr: function() {
			uni.scanCode({
				success: res => {
					let option = handleUrlParam(res.result);

					switch (option.pageType) {
						case 'good':
							// 跳转商品详情
							this.$yrouter.push({
								path: '/pages/shop/GoodsCon/index',
								query: {
									q: res.result
								}
							});
							break;
						case 'group':
							// 跳转团购
							this.$yrouter.push({
								path: '/pages/activity/GroupRule/index',
								query: {
									q: res.result
								}
							});
							break;
						case 'coupon':
							/* console.log(res.result.split("?")[0]) */
							exchange({ qrCode: this.getQueryVariable('code',res.result) }).then(res => {
								if (res.success) {
									uni.showToast({
										title: '兑换成功，请在个人中心优惠券中查看',
										icon: 'none',
										duration: 2000
									});
								}
							});
							break;
						case 'dargain':
							// 跳转砍价
							this.$yrouter.push({
								path: '/pages/activity/DargainDetails/index',
								query: {
									q: res.result
								}
							});
							break;
						default:
							// 跳转分销
							this.$yrouter.push({
								path: '/pages/Loading/index',
								query: {}
							});
							break;
					}
				}
			});
		},
		getQueryVariable(variable,url) {
			var query = url;
			var vars = query.split('&');
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split('=');
				if (pair[0] == variable) {
					return pair[1];
				}
			}
			return false;
		},
		getbgcolor(e) {
			this.bgcolor = e;
		}
	},
	created: async function() {
		// await this.doColorThief();
	}
};
</script>
<style scoped lang="less">
.content_box {
	background: #f6f6f6;
}

.index {
	background-color: #f6f6f6;
}

.swiper-item {
	height: 100%;
}

.fixed-header {
	position: fixed;
	z-index: 99;
	// #ifdef H5
	top: 88rpx;
	// #endif

	// #ifndef H5
	top: 0;
	// #endif
	left: 0;
	right: 0;
	background: #fff;
	box-shadow: 0 0 20rpx -10rpx #aaa;

	& + .fixed-header-box {
		height: 98rpx;
	}
}

.head_box {
	width: 750rpx;
	// background: #fff;
	transition: all linear 0.3s;

	/deep/.cuIcon-back {
		display: none;
	}

	.nav-title {
		font-size: 38rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #fff;
	}
}

.cu-bar.fixed {
	position: fixed;
	width: 100%;
	top: 0;
	z-index: 1024;
	// box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
}

.cu-bar {
	box-sizing: border-box;

	.index .header {
		height: 64rpx;
		// width: 100%;
		// padding: 0 30rpx;
		// box-sizing: border-box;
	}
}

.header-search {
	transition: all linear 0.3s;
}

.cu-bar .action {
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	align-items: center;
	height: 100%;
	max-height: 100%;

	&:first-child {
		margin-left: 15px;
		font-size: 15px;
	}
}

.home_content_box {
	margin-top: -20rpx;
}

.head_box {
}

.nav-title {
	margin-left: 20rpx;
	line-height: 40px;
}
</style>
