<template>
	<view :style="pageBackGround">
		<block v-if="tpl.mode === 2 || tpl.mode === 3">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" @emptyclick="downCallback" @topclick="topClick">
				<view v-if="tpl.image" class="image-box" :style="{height: imageHeight + 'rpx'}">
					<image class="swiper-image" :style="{height: imageHeight + 'rpx'}" :src="tpl.image" @load="imageLoad"></image>
				</view>
				<view class="body-tabbar-height"></view>
				<view id="tabInList" v-if="tpl.mode == 3 && tpl.navbar == 0" :style="{backgroundImage:whiteBgColor ? '#FFFFFF' : '', opacity: transparent == 1 ? 0 : 1}">
					<np-tab v-model="tabIndex" :lines="false" :textColor="whiteBgColor ? '#777777' : '#FFFFFF'" :height="whiteBgColor ? 100 : 60"
					 :tabWidth="tabWidth" :tabs="tabs" @change="tabChange"></np-tab>
					<view class="body-tabbar-height"></view>
				</view>
				<np-list-two v-if="gridCol == 1" :goodsList="goods"></np-list-two>
				<np-list-one v-else :goodsList="goods"></np-list-one>
			</mescroll-body>
		</block>
	</view>
</template>

<script>
	import moreGoodList from '@/api/good.json';
	const whiteList = ['#FFF', '#FFFFFF', '#ffffff', '#fff', '#f8f8f8', '#F8F8F8', 'white', 'rgb(255,255,255)',
		'rgba(255,255,255,1)'
	];
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	let loading = false;
	export default {
		mixins: [MescrollMixin],
		components: {},
		data() {
			return {
				downOption: {
					textColor: '#777777',
				},
				upOption: {
					textColor: '#777777',
					empty: {
						whiteBtn: false,
						textColor: '#777777',
						tip: '~ 空空如也 ~',
						btnText: '重新加载'
					},
					noMoreSize: 4,
				},
				tabs: [{
					id: 0,
					title: '综合',
					minId: 1,
					goods: null,
					num: 1,
					y: 0,
					curPageLen: 0,
					hasNext: true
				}],
				tabsLoad: false,
				tabIndex: 0,
				preIndex: 0,
				navTop: null,
				isShowSticky: false,
				//模版数据相关
				fixedNav: false,
				showBackIcon: true,
				show: false,
				showTabList: false,
				tplId: 0,
				tpl: {},
				tplLoad: false,
				navbarColorList: "",
				angle: 45,
				tabWidth: 100,
				navTextColor: '#000000',
				pageBackGround: "backgroundImage:#f8f8f8",
				whiteBgColor: false,
				gridCol: 1,
				imageHeight: 200,
				scrollTop: 0,
				transparent: 0
			}
		},
		onLoad(option) {
			// #ifdef H5
			if (option.tab) {
				this.showBackIcon = false;
			}
			// #endif
			if (option.tpl) {
				this.tplId = option.tpl;
			}
			this.getTpl();
		},
		computed: {
			goods() {
				return this.tabs[this.tabIndex].goods
			}
		},
		onShareAppMessage(res) {
			let parentId = this.$config.getParentId();
			if (this.hasLogin) {
				parentId = this.userInfo.id;
			}
			let path = '/pages/list/list?uid=' + parentId + '&tpl=' + this.tpl.id;
			let title = this.tpl.title;
			return {
				title: title,
				path: path,
			};
		},
		methods: {
			getTpl() {
				let sentData = {};
				let res = moreGoodList.data
				this.tpl = res.tpl;
				this.setStyle(res.tpl);
				/* sentData.tpl = this.tplId;
				sentData.page = 1;
				sentData.min_id = 1;
				sentData.first = 1;
				
				this.$http.get('api/default/list', {
					params: sentData
				}).then((res) => {
					this.tpl = res.tpl;
					this.setStyle(res.tpl);
				}).catch((error) => {
					this.setStyle(error.data.tpl);
					this.$config.toast(error.message, 2000);
				}); */
			},
			
			setStyle(item) {
				uni.setNavigationBarTitle({
					title: item.title
				});
				item.mode = parseInt(item.mode);
				item.navbar = parseInt(item.navbar);
				this.tpl = item;
				let tabs = item.tabs;
				tabs.forEach((item) => {
					item.goods = null;
					item.num = 1;
					item.y = 0;
					item.curPageLen = 0;
					item.hasNext = true;
					item.minId = 1;
				});
				this.tabs = JSON.parse(JSON.stringify(tabs));
				this.tabsLoad = true;
				if (item.navbar == 1) {
					this.fixedNav = true;
				}
				this.gridCol = parseInt(item.grid);
				this.navbarColorList = item.nav_color;
				this.angle = parseInt(item.angle);
				this.tabWidth = parseInt(item.tab_width);
				if (typeof item.nav_color == 'string') {
					let isWhite = whiteList.includes(item.nav_color);
					this.navTextColor = isWhite ? '#000000' : '#FFFFFF';
				} else if (item.nav_color.length >= 2) {
					this.navTextColor = '#FFFFFF';
				}
				if (typeof item.bg_color == 'string') {
					this.pageBackGround = "background:" + item.bg_color;
					this.whiteBgColor = whiteList.includes(item.bg_color);

				} else if (item.bg_color.length >= 2) {
					let pageBackGround = 'linear-gradient(' + item.angle + 'deg';
					item.bg_color.forEach(item => {
						if (typeof item == 'string') {
							pageBackGround += ',' + item;
						}
					});
					pageBackGround += ')';
					this.pageBackGround = "background:" + pageBackGround;
					this.whiteBgColor = false;
				}
				if (!this.whiteBgColor) {
					this.upOption.empty.whiteBtn = true;
					this.upOption.empty.textColor = '#FFFFFF';
					this.upOption.textColor = '#FFFFFF';
					this.downOption.textColor = '#FFFFFF';
				}
				if (!this.whiteBgColor && item.navbar == 0) {
					this.navbarColorList = item.bg_color;
				}
				this.show = true;
			},
			imageLoad(e) {
				let imageHeight = e.detail.height || e.height;
				this.imageHeight = imageHeight;
			},
			downCallback() {
				let tabItem = this.tabs[this.tabIndex];
				tabItem.minId = 1;
				this.mescroll.resetUpScroll()
			},
			upCallback(page) {
				if (this.isChangeTab) {
					this.mescroll.hideUpScroll();
					uni.showLoading();
				}
				if (loading) {
					this.mescroll.setPageNum(page.num);
					return;
				}
				loading = true;
				let tabItem = this.tabs[this.tabIndex];
				let data = {
					tpl: this.tplId,
					page: page.num,
					id: tabItem.id,
					min_id: tabItem.minId
				}
				/* this.$http.get('api/default/list', {
					params: data
				}).then(res => { */
					loading = false;
					if (page.num == 1) {
						tabItem.goods = [];
					}
					let res =  moreGoodList.data
					let goodsList = res.list;
					tabItem.goods = tabItem.goods.concat(res.list);
					setTimeout(() => {
						let curPageLen = res.list.length;
						let hasNext = curPageLen < 10 ? false : true;
						this.mescroll.endSuccess(curPageLen, hasNext);
						tabItem.num = page.num;
						tabItem.minId = res.min_id;
						tabItem.curPageLen = curPageLen;
						tabItem.hasNext = hasNext;
						if (!this.navTop && this.tpl.mode == 3 && this.tpl.navbar == 0) {
							this.setNavTop();
						}
						if (this.isChangeTab) {
							this.isChangeTab = false;
							uni.hideLoading();
							if (this.isShowSticky) this.mescroll.scrollTo(this.navTop, 0)
						}
					}, 500);
				/* }).catch((error) => {
					loading = false;
					this.mescroll.endErr();
				}); */
			},
			setNavTop() {
				if (this.tpl.navbar == 1) return;
				let statusbar = 0;
				// #ifndef H5
				statusbar = uni.getSystemInfoSync().statusBarHeight;
				// #endif
				
				let view = uni.createSelectorQuery().select('#tabInList');
				view.boundingClientRect(data => {
					this.navTop = data.top - statusbar - 44
				}).exec();
			},
			topClick() {
				this.isShowSticky = false
			},
			// 切换菜单
			tabChange(index) {
				let preTab = this.tabs[this.preIndex]
				preTab.y = this.mescroll.getScrollTop();
				this.preIndex = index;
				let curTab = this.tabs[index]
				if (!curTab.goods || curTab.goods.length == 0) {
					curTab.minId = 1;
					this.isChangeTab = true;
					this.mescroll.resetUpScroll()
				} else {
					this.mescroll.setPageNum(curTab.num + 1);
					this.mescroll.endSuccess(curTab.curPageLen, curTab.hasNext);
					this.$nextTick(() => {
						this.mescroll.scrollTo(curTab.y, 0)
					})
				}
			}
		},
		onPageScroll(e) {
			if (this.tpl.navbar == 1) return;
			this.scrollTop = e.scrollTop;
			if (!this.navTop) {
				this.navTop = uni.getSystemInfoSync().statusBarHeight + 44;
			}
			if (e.scrollTop >= this.navTop) {
				this.showTabList = true;
				this.isShowSticky = true;
				this.transparent = 1;
			} else {
				this.showTabList = false;
				this.isShowSticky = false;
				this.transparent = 0;
			}
		}
	}
</script>

<style>
	.top-tabbar-height {
		min-height: 20rpx;
	}
	
	.body-tabbar-height{
		height: 10rpx;
	}

	.swiper-image {
		width: 750rpx;
		height: 100%;
	}
</style>
