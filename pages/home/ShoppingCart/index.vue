<template>
	<view class="shoppingCart">
		<view v-if="$store.getters.token || userInfo.uid">
			<view class="labelNav acea-row row-around row-middle">
				<view class="item">
					<text class="iconfont icon-xuanzhong"></text>
					100%正品保证
				</view>
				<view class="item">
					<text class="iconfont icon-xuanzhong"></text>
					所有商品精挑细选
				</view>
				<view class="item">
					<text class="iconfont icon-xuanzhong"></text>
					售后无忧
				</view>
			</view>
			<view v-if="cartList.invalid.length > 0" class="type-nav">
				<block v-for="(good, goodIndex) in cartList">
					<view v-if="goodIndex != 'invalid' && goodIndex != 'valid' && goodIndex != '极速达商品'" class="cartNav acea-row row-between-wrapper" :class="goodIndex == '普通商品' ? 'first-cart' : ''">
						<view class="checkbox-wrapper">
							<checkbox-group @change="switchParentSelect(good, goodIndex)">
								<label class="well-check"><checkbox color="#eb3729" value :checked="parentsList.indexOf(goodIndex) != -1"></checkbox></label>
							</checkbox-group>
						</view>
						<view>
							{{ goodIndex }}
							<text class="num font-color-red">{{ good.length }}</text>
						</view>
						<view class="administrate acea-row row-center-wrapper" @click="manage">{{ footerswitch ? '取消' : '管理' }}</view>
					</view>
					<view class="list" v-if="goodIndex != 'invalid' && goodIndex != 'valid' && goodIndex != '极速达商品'">
						<view class="item acea-row row-between-wrapper" v-for="(item, cartListValidIndex) in good" :key="cartListValidIndex">
							<view class="select-btn">
								<view class="checkbox-wrapper">
									<checkbox-group @change="switchSelect(good, goodIndex, item)">
										<label class="well-check"><checkbox color="#eb3729" value :checked="item.checked"></checkbox></label>
									</checkbox-group>
								</view>
							</view>
							<view class="picTxt acea-row row-between-wrapper">
								<view class="pictrue" @click="goGoodsCon(item)">
									<image :src="item.productInfo.attrInfo.image" v-if="item.productInfo.attrInfo" />
									<image :src="item.productInfo.image" v-else />
								</view>
								<view class="text">
									<view class="line1">{{ item.productInfo.storeName }}</view>
									<view class="infor line1" v-if="item.productInfo.attrInfo">属性：{{ item.productInfo.attrInfo.sku }}</view>
									<view class="money">￥{{ item.truePrice }}</view>
								</view>
								<view class="carnum acea-row row-center-wrapper">
									<view class="reduce" :class="good[cartListValidIndex].cartNum <= 1 ? 'on' : ''" @click.prevent="reduce(item, cartListValidIndex)">-</view>
									<view class="num">{{ item.cartNum }}</view>
									<view
										class="plus"
										v-if="good[cartListValidIndex].attrInfo"
										:class="good[cartListValidIndex].cartNum >= good[cartListValidIndex].attrInfo.stock ? 'on' : ''"
										@click.prevent="plus(item, cartListValidIndex)"
									>
										+
									</view>
									<view
										class="plus"
										v-else
										:class="good[cartListValidIndex].cartNum >= good[cartListValidIndex].stock ? 'on' : ''"
										@click.prevent="plus(item, cartListValidIndex)"
									>
										+
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<view class="invalidGoods" v-if="cartList.invalid.length > 0">
					<view class="goodsNav acea-row row-between-wrapper">
						<view @click="goodsOpen">
							<text class="iconfont" :class="goodsHidden === true ? 'icon-xiangyou' : 'icon-xiangxia'"></text>
							失效商品
						</view>
						<view class="del" @click="delInvalidGoods">
							<text class="iconfont icon-shanchu1"></text>
							清空
						</view>
					</view>
					<view class="goodsList" :hidden="goodsHidden">
						<view v-for="(item, cartListinvalidIndex) in cartList.invalid" :key="cartListinvalidIndex">
							<view @click="goGoodsCon(item)" class="item acea-row row-between-wrapper" v-if="item.productInfo">
								<view class="invalid acea-row row-center-wrapper">失效</view>
								<view class="pictrue">
									<image :src="item.productInfo.attrInfo.image" v-if="item.productInfo.attrInfo" />
									<image :src="item.productInfo.image" v-else />
								</view>
								<view class="text acea-row row-column-between">
									<view class="line1">{{ item.productInfo.storeName }}</view>
									<view class="infor line1" v-if="item.productInfo.attrInfo">属性：{{ item.productInfo.attrInfo.sku }}</view>
									<view class="acea-row row-between-wrapper"><view class="end">该商品已下架</view></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!--购物车暂无商品-->
			<view class="noCart" v-if="count === 0">
				<view class="pictrue"><image :src="`${$VUE_APP_RESOURCES_URL}/images/noCart.png`" /></view>
				<Recommend></Recommend>
			</view>
			<view style="height:210rpx"></view>
			<view :class="{ 'footer acea-row row-between-wrapper': true, 'footer-h5': isH5 }" v-if="count > 0">
				<view>
					<view class="select-btn">
						<view class="checkbox-wrapper">
							<!-- <label class="well-check">
              <input
                type="checkbox"
                name
                value
                :checked="isAllSelect && cartCount > 0"
                @click="allChecked"
              />
              <i class="icon"></i>
              <text class="checkAll">全选 ({{ cartCount }})</text>
              </label>-->

							<checkbox-group @change="allChecked">
								<label class="well-check">
									<checkbox color="#eb3729" value="allSelect" :checked="isAllSelect && cartCount > 0"></checkbox>
									<text class="checkAll">全选 ({{ cartCount }})</text>
								</label>
							</checkbox-group>
						</view>
					</view>
				</view>
				<view class="money acea-row row-middle" v-if="footerswitch === false">
					<text class="font-color-red">￥{{ countmoney }}</text>
					<view class="placeOrder bg-color-red" @click="placeOrder">立即下单</view>
				</view>
				<view class="button acea-row row-middle" v-else>
					<!-- <view class="bnt cart-color" @click="collectAll">收藏</view> -->
					<view class="bnt" @click="delgoods">删除</view>
				</view>
			</view>
		</view>
		<Authorization v-else />
	</view>
</template>
<script>
import Recommend from '@/components/Recommend';
import Authorization from '@/pages/authorization/index';
import { mapGetters } from 'vuex';

import { getCartList, postCartDel, changeCartNum, getCartCount } from '@/api/store';
import { postCollectAll } from '@/api/user';
import { mul, add } from '@/utils/bc';
import cookie from '@/utils/store/cookie';

const CHECKED_IDS = 'cart_checked';

export default {
	name: 'ShoppingCart',
	components: {
		Recommend,
		Authorization
	},
	props: {},
	data: function() {
		return {
			cartList: {
				invalid: [],
				valid: []
			},
			isH5: false,
			validList: [],
			parentsList: [],
			isAllSelect: false,
			cartCount: 0,
			countmoney: 0,
			goodsHidden: true,
			footerswitch: false,
			count: 0,
			checkedIds: [],
			loaded: false
		};
	},
	computed: mapGetters(['userInfo', 'token']),
	//   watch: {
	//     $yroute(n) {
	//       if (n.name === "ShoppingCart") {
	//         this.carnum();
	//         this.countMoney();
	//         this.getCartList();
	//         this.gainCount();
	//         this.goodsHidden = true;
	//         this.footerswitch = false;
	//       }
	//     },
	//     cartList(list) {
	//       this.validList = list.valid;
	//     }
	//   },
	watch: {
		userInfo(user) {
			if (user.uid) {
				this.carnum();
				this.countMoney();
				this.getCartList();
				this.gainCount();
			}
		},
		token(token) {
			if (this.userInfo.uid) {
				this.carnum();
				this.countMoney();
				this.getCartList();
				this.gainCount();
			}
		}
		/* cartList(list) {
      this.validList = list.valid
    }, */
	},
	onShow: function() {
		// #ifdef H5
		this.isH5 = true;
		// #endif
		if (this.userInfo.uid) {
			this.carnum();
			this.countMoney();
			this.getCartList();
			this.gainCount();
		}
	},
	methods: {
		goGoodsCon(item) {
			this.$yrouter.push({
				path: '/pages/shop/GoodsCon/index',
				query: {
					id: item.productId
				}
			});
		},
		getCartList: function() {
			let that = this;
			getCartList().then(res => {
				that.cartList = res.data;
				that.parentsList = [];
				let checkedIds = cookie.get(CHECKED_IDS) || [];
				if (!Array.isArray(checkedIds)) checkedIds = [];
				let count = 0;
				for (var item in that.cartList) {
					if (item != 'invalid' && item != 'valid' && item != '极速达商品') {
						let childCount = 0;
						that.cartList[item].forEach((cart, cartIndex) => {
							if (checkedIds.indexOf(cart.id) !== -1) {
								cart.checked = true;
								if (cartIndex == childCount) {
									that.parentsList.push(item);
								}
								childCount++;
							}
							count++;
						});
					}
				}
				if (checkedIds.length) {
					that.checkedIds = checkedIds;
					that.isAllSelect = checkedIds.length === count;
					that.carnum();
					that.countMoney();
				}
				this.loaded = true;
			});
		},
		//删除商品；
		delgoods: function() {
			let that = this,
				id = [],
				valid = [],
				list = that.cartList;
			for (var item in that.cartList) {
				if (item != 'invalid' && item != 'valid' && item != '极速达商品') {
					that.cartList[item].forEach(cart => {
						if (cart.checked === true) {
							id.push(cart.id);
						}
					});
				}
			}
			/* list.forEach(function(val) {
				if (val.checked === true) {
					id.push(val.id);
				}
			}); */
			if (id.length === 0) {
				uni.showToast({
					title: '请选择产品',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			postCartDel(id).then(function() {
				/* list.forEach(function(val, i) {
					if (val.checked === false || val.checked === undefined) valid.push(list[i]);
				});
				that.$set(that.cartList, 'valid', valid); */
				that.carnum();
				that.countMoney();
				that.gainCount();
				that.getCartList();
			});
		},
		// //获取数量
		gainCount: function() {
			let that = this;
			getCartCount().then(res => {
				that.count = res.data.count;
			});
		},
		//清除失效产品；
		delInvalidGoods: function() {
			let that = this,
				id = [],
				list = that.cartList.invalid;
			list.forEach(function(val) {
				id.push(val.id);
			});
			postCartDel(id).then(function() {
				list.splice(0, list.length);
				that.gainCount();
				that.getCartList();
			});
		},
		//批量收藏;
		collectAll: function() {
			let that = this,
				data = {
					id: [],
					category: ''
				},
				list = that.cartList.valid;
			list.forEach(function(val) {
				if (val.checked === true) {
					data.id.push(val.product_id);
					data.category = val.type;
				}
			});
			if (data.id.length === 0) {
				uni.showToast({
					title: '请选择产品',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			postCollectAll(data).then(function() {
				uni.showToast({
					title: '收藏成功!',
					icon: 'none',
					duration: 2000
				});
			});
		},
		//立即下单；
		placeOrder: function() {
			let that = this,
				list = that.cartList,
				arr = [];
			for (var item in that.cartList) {
				if (item != 'invalid' && item != 'valid' && item != '极速达商品') {
					let id = [];
					that.cartList[item].forEach((cart, index) => {
						if (cart.checked === true) {
							id.push(cart.id);
						}
					});
					arr.push(id);
				}
			}
			if (arr.length === 0) {
				uni.showToast({
					title: '请选择产品',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			this.$yrouter.push({
				path: '/pages/order/OrderSubmission/index',
				query: {
					id: JSON.stringify(arr)
				}
			});
		},
		manage: function() {
			let that = this;
			that.footerswitch = !that.footerswitch;
		},
		goodsOpen: function() {
			let that = this;
			that.goodsHidden = !that.goodsHidden;
		},
		//加
		plus: function(item, index) {
			let that = this;
			let list = item;
			list.cartNum++;
			if (list.attrInfo) {
				if (list.cartNum >= list.attrInfo.stock) {
					that.$set(list, 'cart_num', list.attrInfo.stock);
				}
			} else {
				if (list.cartNum >= list.stock) {
					that.$set(list, 'cart_num', list.stock);
				}
			}
			that.carnum();
			that.countMoney();
			that.syncCartNum(list);
		},
		//减
		reduce: function(item, index) {
			let that = this;
			let list = item;
			if (list.cartNum <= 1) {
				uni.showToast({
					title: '已经是底线啦!',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			list.cartNum--;
			if (list.cartNum < 1) {
				that.$set(list, 'cart_num', 1);
			}
			that.carnum();
			that.countMoney();
			that.syncCartNum(list);
		},
		syncCartNum(cart) {
			if (!cart.sync) {
				changeCartNum(cart.id, Math.max(cart.cartNum, 1) || 1)
					.then(res => {
						this.getCartList();
						this.gainCount();
					})
					.catch(error => {
						this.gainCount();
						uni.showToast({
							title: error.response.data.msg,
							icon: 'none',
							duration: 2000
						});
					});
			}
		},
		//子集全选
		switchParentSelect: function(good, index) {
			let that = this;
			if (that.parentsList.indexOf(index) == -1) {
				good.forEach(item => {
					let i = that.checkedIds.indexOf(item.id);
					item.checked = true;
					if (i !== -1) that.checkedIds.splice(i, 1);
					if (item.checked) {
						that.checkedIds.push(item.id);
					}
				});
				that.parentsList.push(index);
			} else {
				good.forEach(item => {
					let i = that.checkedIds.indexOf(item.id);
					item.checked = false;
					if (i !== -1) that.checkedIds.splice(i, 1);
				});
				that.parentsList.splice(that.parentsList.indexOf(index), 1);
			}
			let ccarnum = 0;
			for (var item in that.cartList) {
				if (item != 'invalid' && item != 'valid' && item != '极速达商品') {
					that.cartList[item].forEach(cart => {
						if (cart.checked === true) {
							ccarnum += parseInt(cart.cartNum);
						}
					});
				}
			}
			that.isAllSelect = ccarnum === that.count;
			that.$set(that, 'cartList', that.cartList);
			that.$set(that, 'isAllSelect', that.isAllSelect);
			cookie.set(CHECKED_IDS, that.checkedIds);
			that.carnum();
			that.gainCount();
			that.countMoney();
		},
		//单选
		switchSelect: function(good, goodIndex, item) {
			let that = this,
				cart = item,
				i = this.checkedIds.indexOf(cart.id);
			cart.checked = !cart.checked;
			if (i !== -1) this.checkedIds.splice(i, 1);
			if (cart.checked) {
				this.checkedIds.push(cart.id);
			}
			let len = good.length;
			let selectnum = [];
			for (let i = 0; i < len; i++) {
				if (good[i].checked === true) {
					selectnum.push(true);
				}
			}
			if (selectnum.length === len) {
				that.parentsList.push(goodIndex);
			} else {
				if (that.parentsList.indexOf(goodIndex) != -1) {
					that.parentsList.splice(that.parentsList.indexOf(goodIndex), 1);
				}
			}
			let ccarnum = 0;
			for (var item in that.cartList) {
				if (item != 'invalid' && item != 'valid' && item != '极速达商品') {
					that.cartList[item].forEach(cart => {
						if (cart.checked === true) {
							ccarnum += parseInt(cart.cartNum);
						}
					});
				}
			}
			that.isAllSelect = ccarnum === that.count;
			that.$set(that, 'cartList', that.cartList);
			that.$set(that, 'isAllSelect', that.isAllSelect);
			cookie.set(CHECKED_IDS, that.checkedIds);
			that.carnum();
			that.gainCount();
			that.countMoney();
		},
		//全选
		allChecked: function(e) {
			console.log(e);
			let that = this;
			that.parentsList = [];
			let selectAllStatus = e.mp.detail.value[0] == 'allSelect' ? true : false;
			// let selectAllStatus = that.isAllSelect;
			let checkedIds = [];
			// for (let i = 0; i < array.length; i++) {
			//   array[i].checked = selectAllStatus;
			//   checked.push()
			// }
			for (var item in that.cartList) {
				if (item != 'invalid' && item != 'valid' && item != '极速达商品') {
					let childCount = 0;
					that.cartList[item].forEach((cart, cartIndex) => {
						cart.checked = selectAllStatus;
						if (selectAllStatus) {
							checkedIds.push(cart.id);
							if (cartIndex == childCount) {
								that.parentsList.push(item);
							}
							childCount++;
						}
					});
				}
			}
			/* that.cartList.valid.forEach(cart => {
				cart.checked = selectAllStatus;
				if (selectAllStatus) {
					checkedIds.push(cart.id);
				}
			}); */
			let cartList = {
				...that.cartList
			};
			that.cartList = [];
			that.cartList = cartList;
			this.$set(this, 'cartList', this.cartList);
			this.$set(this, 'isAllSelect', selectAllStatus);
			this.checkedIds = checkedIds;
			cookie.set(CHECKED_IDS, checkedIds);
			that.carnum();
			that.countMoney();
			this.$forceUpdate();
		},
		//数量
		carnum: function() {
			let that = this;
			var carnum = 0;
			/* var array = that.cartList.valid; */
			for (var item in that.cartList) {
				if (item != 'invalid' && item != 'valid' && item != '极速达商品') {
					that.cartList[item].forEach(cart => {
						if (cart.checked === true) {
							carnum += parseInt(cart.cartNum);
						}
					});
				}
			}
			/* for (let i = 0; i < array.length; i++) {
				if (array[i].checked === true) {
					carnum += parseInt(array[i].cartNum);
				}
			} */
			that.$set(that, 'cartCount', carnum);
		},
		//总共价钱；
		countMoney: function() {
			let that = this;
			let carmoney = 0;
			/* let array = that.cartList.valid; */
			for (var item in that.cartList) {
				if (item != 'invalid' && item != 'valid' && item != '极速达商品') {
					that.cartList[item].forEach(cart => {
						if (cart.checked === true) {
							carmoney = add(carmoney, mul(cart.cartNum, cart.truePrice));
						}
					});
				}
			}
			/* for (let i = 0; i < array.length; i++) {
				if (array[i].checked === true) {
					carmoney = add(carmoney, mul(array[i].cartNum, array[i].truePrice));
				}
			} */
			that.countmoney = carmoney;
		}
	}
};
</script>

<style lang="less">
.footer-h5 {
	bottom: 50px;
}
.shoppingCart,
.type-nav {
	position: relative;
}
.cartNav {
	width: 100%;
	height: 80rpx;
	background-color: #fff;
	padding: 0 30rpx;
	font-size: 28rpx;
	color: #282828;
	margin-top: 20rpx;
	border-bottom: 1px solid #f5f5f5;
}
.first-cart {
	margin-top: 80rpx;
}
.shoppingCart .list {
	margin-top: 0rpx !important;
}
</style>
