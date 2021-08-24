<template>
	<view class="productList" ref="container">
		<form @submit.prevent="submitForm">
			<view class="search bg-color-red acea-row row-between-wrapper">
				<view class="input acea-row row-between-wrapper">
					<input placeholder="搜索商品信息" v-model="where.keyword" />
					<text class="iconfont icon-sousuo" @click="submitForm"></text>
				</view>
				<view class="iconfont" :class="Switch === true ? 'icon-pailie' : 'icon-tupianpailie'" @click="switchTap"></view>
			</view>
		</form>
		<view class="mask" :class="{ show: isShowMask, hide: maskVisibility != true }" @tap="togglePage"></view>
		<block v-for="(page, page_index) in subData" :key="page_index">
			<view class="sub-menu-class" :class="{ show: showPage, hide: !showPage }">
				<block v-if="page.children.length > 0">
					<scroll-view
						class="sub-menu-list"
						:class="[activeMenuArr[page_index].length > 1 ? 'first' : 'alone']"
						:scroll-y="true"
						:scroll-into-view="'first_id' + firstScrollInto"
					>
						<block v-for="(sub, index) in page.children" :key="index">
							<view
								class="sub-menu"
								:id="'first_id' + index"
								:class="{ on: activeMenuArr[page_index][0] == index }"
								@tap="selectHierarchyMenu(page_index, index, null, null)"
							>
								<view class="menu-name">
									<text>{{ sub.cateName }}</text>
									<text class="iconfont selected"></text>
								</view>
							</view>
						</block>
					</scroll-view>
					<block v-for="(sub, index) in page.children" :key="index">
						<scroll-view
							class="sub-menu-list not-first"
							:scroll-y="true"
							v-if="activeMenuArr[page_index][0] == index && sub.children.length > 0"
							:scroll-into-view="'second_id' + secondScrollInto"
						>
						
							<block v-for="(sub_second, second_index) in sub.children" :key="second_index">
								<view class="sub-menu" :id="'second_id' + second_index" :class="{ on: activeMenuArr[page_index][1] == second_index }">
									<view class="menu-name" @tap="selectHierarchyMenu(page_index, activeMenuArr[page_index][0], second_index, null)">
										<text>{{ sub_second.cateName }}</text>
										<text class="iconfont selected"></text>
									</view>
									<view class="more-sub-menu" v-if="sub_second.children && sub.children.length > 0 && sub_second.children.length > 0">
										<block v-for="(sub2, sub2_index) in sub_second.children" :key="sub2_index">
											<text
												v-if="sub_second.showAllSub || sub2_index < 8"
												:class="{ on: activeMenuArr[page_index][1] == second_index && activeMenuArr[page_index][2] == sub2_index }"
												@tap="selectHierarchyMenu(page_index, activeMenuArr[page_index][0], second_index, sub2_index)"
											>
												{{ sub2.cateName }}
											</text>
											<text v-if="sub_second.showAllSub != true && sub2_index == 8 && sub_second.children.length > 9" @tap="showMoreSub(second_index)">
												更多
												<text class="iconfont triangle"></text>
											</text>
										</block>
									</view>
								</view>
							</block>
						</scroll-view>
					</block>
				</block>
			</view>
		</block>
		<view class="nav acea-row row-middle">
			<view v-if="type==1" class="item" :class="{ on: showPage }" @tap="togglePage">
				<text class="name text-cut">{{ title ? title : '分类查找' }}</text>
				<text class="iconfont triangle" :style="'display: inline-block;transform:rotate(' + (showPage ? '180' : '0') + 'deg);'"></text>
			</view>
			<view v-else class="item" :class="title ? 'font-color-red' : ''" >{{ title ? title : '默认' }}</view><!-- @click="set_where(0)" -->
			<view class="item" @click="set_where(1)">
				价格
				<image :src="`${$VUE_APP_RESOURCES_URL}/images/horn.png`" v-if="price === 0" />
				<image :src="`${$VUE_APP_RESOURCES_URL}/images/up.png`" v-if="price === 1" />
				<image :src="`${$VUE_APP_RESOURCES_URL}/images/down.png`" v-if="price === 2" />
			</view>
			<view class="item" @click="set_where(2)">
				销量
				<image :src="`${$VUE_APP_RESOURCES_URL}/images/horn.png`" v-if="stock === 0" />
				<image :src="`${$VUE_APP_RESOURCES_URL}/images/up.png`" v-if="stock === 1" />
				<image :src="`${$VUE_APP_RESOURCES_URL}/images/down.png`" v-if="stock === 2" />
			</view>
			<!-- down -->
			<view class="item" :class="nows ? 'font-color-red' : ''" @click="set_where(3)">新品</view>
		</view>

		<!--list-->
		<view class="tui-product-list" v-if="!isIntegral">
			<view class="tui-product-container" v-if="Switch">
				<block v-for="(item, productListIndex) in productList" :key="productListIndex" :title="item.storeName">
					<!--商品列表-->
					<view
						class="tui-pro-item"
						:class="[Switch ? 'tui-flex-list' : '']"
						hover-class="tui-hover"
						:hover-start-time="150"
						@tap="isIntegral !== 'true' ? goGoodsCon(item) : goIntegralGoodsCon(item)"
					>
						<image :src="item.image" class="tui-pro-img" :class="[Switch ? 'tui-proimg-list' : '']" mode="aspectFill" />
						<view class="tip one-t" v-if="item.productText">{{ item.productText }}</view>
						<view class="tui-pro-content">
							<view class="tui-pro-tit">{{ item.storeName }}</view>
							<view>
								<view class="tui-pro-price">
									<text class="tui-sale-price">￥{{ item.price }}</text>
									<text class="tui-factory-price">￥{{ item.otPrice }}</text>
								</view>
								<view class="tui-pro-pay">已售{{ item.sales }}件</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
			<view class="tui-product-container" v-if="!Switch">
				<block v-for="(item, productListIndex) in productList" :key="productListIndex" :title="item.storeName">
					<!--商品列表-->
					<view
						class="tui-pro-item"
						:class="[Switch ? 'tui-flex-list' : '']"
						hover-class="tui-hover"
						:hover-start-time="150"
						@tap="isIntegral !== 'true' ? goGoodsCon(item) : goIntegralGoodsCon(item)"
					>
						<image :src="item.image" class="tui-pro-img" :class="[Switch ? 'tui-proimg-list' : '']" mode="aspectFill" />
						<view class="tip one-t" v-if="item.productText">{{ item.productText }}</view>
						<view class="tui-pro-content">
							<view class="tui-pro-tit">{{ item.storeName }}</view>
							<view>
								<view class="tui-pro-price">
									<text class="tui-sale-price">￥{{ item.price }}</text>
									<text class="tui-factory-price">￥{{ item.otPrice }}</text>
								</view>
								<view class="tui-pro-pay">已售{{ item.sales }}件</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
		</view>

		<!--list-->
		<view class="tui-product-list" v-if="isIntegral == 'true'">
			<view class="tui-product-container" v-if="Switch">
				<block v-for="(item, productListIndex) in productList" :key="productListIndex" :title="item.storeName">
					<!--商品列表-->
					<view
						class="tui-pro-item"
						:class="[Switch ? 'tui-flex-list' : '']"
						hover-class="tui-hover"
						:hover-start-time="150"
						@tap="isIntegral !== 'true' ? goGoodsCon(item) : goIntegralGoodsCon(item)"
					>
						<image :src="item.image" class="tui-pro-img" :class="[Switch ? 'tui-proimg-list' : '']" mode="aspectFill" />
						<view class="tip one-t" v-if="item.productText">{{ item.productText }}</view>
						<view class="tui-pro-content">
							<view class="tui-pro-tit">{{ item.storeName }}</view>
							<view>
								<view class="tui-pro-price">
									<text class="tui-sale-price">{{ item.integral }}积分</text>
								</view>
								<view class="tui-pro-pay">已售{{ item.sales }}件</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
			<view class="tui-product-container" v-if="!Switch">
				<block v-for="(item, productListIndex) in productList" :key="productListIndex" :title="item.storeName">
					<!--商品列表-->
					<view
						class="tui-pro-item"
						:class="[Switch ? 'tui-flex-list' : '']"
						hover-class="tui-hover"
						:hover-start-time="150"
						@tap="isIntegral !== 'true' ? goGoodsCon(item) : goIntegralGoodsCon(item)"
					>
						<image :src="item.image" class="tui-pro-img" :class="[Switch ? 'tui-proimg-list' : '']" mode="aspectFill" />
						<view class="tip one-t" v-if="item.productText">{{ item.productText }}</view>
						<view class="tui-pro-content">
							<view class="tui-pro-tit">{{ item.storeName }}</view>
							<view>
								<view class="tui-pro-price">
									<text class="tui-sale-price">{{ item.integral }}积分</text>
								</view>
								<view class="tui-pro-pay">已售{{ item.sales }}件</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
		</view>

		<Loading :loaded="loadend" :loading="loading"></Loading>
		<view class="noCommodity" style="background-color: #fff" v-if="productList.length === 0 && where.page > 1">
			<view class="noPictrue"><image :src="`${$VUE_APP_RESOURCES_URL}/images/noGood.png`" class="image" /></view>
		</view>
		<Recommend v-if="productList.length === 0 && where.page > 1" :recommendLoading="recommendLoading" @changeRecommendLoading="changeRecommendLoading"></Recommend>
	</view>
</template>
<script>
import Recommend from '@/components/Recommend';
import { getProducts, getProductsIntegral } from '@/api/store';
import Loading from '@/components/Loading';
import { getCategory } from '@/api/store';
export default {
	name: 'GoodsList',
	components: {
		Recommend,
		Loading
	},
	props: {},
	data: function() {
		// const { s = "", id = 0, title = "" } = this.$yroute.query;
		const s = '',
			id = 0,
			title = '';
		return {
			hostProduct: [],
			productList: [],
			subData: [],
			filterData: [],
			Switch: false,
			type: 1,
			isShowMask: false, //遮罩层显示/隐藏动画控制
			maskVisibility: false, //遮罩层显示/隐藏状态
			activeMenuArr: [], //UI状态
			shadowActiveMenuArr: [], //记录选中
			defaultActive: [],
			//滚动区域定位
			firstScrollInto: 0,
			secondScrollInto: 0,
			componentTop: 0, //组件top
			isReadNewSelect: false,
			where: {
				page: 1,
				limit: 8,
				keyword: s,
				sid: id, //二级分类id
				news: 0,
				priceOrder: '',
				salesOrder: ''
			},
			title: title && id ? title : '',
			loadTitle: '',
			loading: false,
			showPage: false,
			loadend: false,
			price: 0,
			stock: 0,
			nows: false,
			recommendLoading: false,
			target: false,
			isIntegral: false
		};
	},
	watch: {
		title() {
			this.updateTitle();
		},
		isIntegral() {
			if (this.isIntegral) {
				uni.setNavigationBarTitle({
					title: '积分商品'
				});
			} else {
				uni.setNavigationBarTitle({
					title: '商品列表'
				});
			}
		},
		filterData: {
			handler(val) {
				if (val.length > 0) {
					this.initMenu(); //filterData重新赋值初始化菜单
				}
			},
			immediate: true
		},
		$yroute(to) {
			// if (to.name !== "GoodsList") return;
			// const { s = "", id = 0, title = "" } = to.query;
			// if (s !== this.where.keyword || id !== this.where.sid) {
			//   this.where.keyword = s;
			//   this.loadend = false;
			//   this.loading = false;
			//   this.where.page = 1;
			//   this.where.sid = id;
			//   this.title = title && id ? title : "";
			//   this.nows = false;
			//   this.$set(this, "productList", []);
			//   this.price = 0;
			//   this.stock = 0;
			//   this.getProductList();
			// }
		}
	},
	mounted: function() {
		const { s = '', id = 0, title = '', isIntegral = false, type } = this.$yroute.query;
		this.where.keyword = s;
		this.title = title;
		this.where.sid = id;
		if (type == 0) {
			this.where.isIntegral = isIntegral == 'true' ? 1 : 0;
		} else if (type == 1) {
			this.where.isIntegral = 0;
		} else if (type == 2) {
			this.where.isIntegral = 2;
		}
		
		this.isIntegral = isIntegral;
		/* this.updateTitle(); */
		this.getProductList();
	},
	async onLoad(option) {
		this.type = option.type;
		await this.getClassfly();
	},
	onReachBottom() {
		this.recommendLoading = true;
		!this.loading && this.getProductList();
	},
	onHide() {},
	methods: {
		defaultSelected(newVal) {
			if(newVal.length==0){
				return;
			}
			this.defaultActive = JSON.parse(JSON.stringify(newVal));
			this.activeMenuArr = JSON.parse(JSON.stringify(newVal));
			this.shadowActiveMenuArr = JSON.parse(JSON.stringify(newVal));
			this.setMenuName();
		},
		setMenuName(){
			for(var i=0;i<this.activeMenuArr.length;i++){
				let row = this.activeMenuArr[i];
				if(this.subData[i].type=='hierarchy'){
					if (typeof(row[0]) == 'number'){
						let tmpsub = this.subData[i].children[row[0]];
						if(row.length>1){
							tmpsub = tmpsub.children[row[1]];
							if(row.length>2){
								tmpsub = tmpsub.children[row[2]];
							}
						}
					}
				}
			}
		},
		initMenu() {
			let tmpMenuActiveArr = [];
			for (let i = 0; i < this.filterData.length; i++) {
				let tmpitem = this.filterData[i];
				//初始化选中项数组-ui状态
				tmpMenuActiveArr.push(this.processActive(tmpitem));
				//递归处理子菜单数据
				tmpitem = this.processSubMenu(tmpitem);
				this.filterData[i] = tmpitem;
			}
			//初始化选中项数组
			tmpMenuActiveArr = this.defaultActive.length > 0 ? this.defaultActive : this.activeMenuArr.length > 0 ? this.activeMenuArr : tmpMenuActiveArr;
			this.defaultActive = [];
			this.activeMenuArr = JSON.parse(JSON.stringify(tmpMenuActiveArr));
			this.shadowActiveMenuArr = JSON.parse(JSON.stringify(tmpMenuActiveArr));
			//加载菜单数据
			this.subData = this.filterData;
			if(this.$yroute.query.pid){
				console.log([this.$yroute.query.pid,this.$yroute.query.id])
				this.defaultSelected([[Number(this.$yroute.query.pid),Number(this.$yroute.query.child)]])
			}else{
				this.setMenuName();
			}
			
		},
		confirm() {
			let index = JSON.parse(JSON.stringify(this.shadowActiveMenuArr));
			let value = JSON.parse(JSON.stringify(this.shadowActiveMenuArr));
			let name = JSON.parse(JSON.stringify(this.shadowActiveMenuArr));
			//对结果做一下处理
			index.forEach((item, i) => {
				if (typeof item[0] == 'object') {
					//针对筛选结果过一个排序
					item.forEach((s, j) => {
						if (s != null) {
							s.sort((val1, val2) => {
								return val1 - val2;
							});
							item[j] = s;
							s.forEach((v, k) => {
								value[i][j][k] = v == null || v >= this.subData[i].children[j].children.length ? null : this.subData[i].children[j].children[v].value;
								name[i][j][k] = v == null || v >= this.subData[i].children[j].children.length ? null : this.subData[i].children[j].children[v].cateName;
								if (value[i][j][k] == null) {
									value[i][j] = [];
									name[i][j] = [];
									index[i][j] = [];
								}
							});
						}
					});
				} else {
					let children = this.subData[i].children[item[0]];
					value[i][0] = children.id;
					name[i][0] = children.cateName;
					if (value[i].length >= 2 && item[1] != null) {
						if (children.children.length > 0) {
							children = children.children[item[1]];
							value[i][1] = children.hasOwnProperty('id') ? children.id : null;
							name[i][1] = children.hasOwnProperty('cateName') ? children.cateName : null;
						} else {
							value[i][1] = null;
							name[i][1] = null;
						}
						if (value[i].length >= 3 && item[2] != null) {
							if (children.children.length > 0) {
								children = children.children[item[2]];
								value[i][2] = children.hasOwnProperty('id') ? children.id : null;
								name[i][2] = children.hasOwnProperty('cateName') ? children.cateName : null;
							} else {
								value[i][2] = null;
								name[i][2] = null;
							}
						}
					}
				}
				index[i] = item;
			});
			console.log({
				index: index,
				name: name,
				value: value
			})
			this.title = name[0][1]
			this.where.sid = value[0][1];
			this.submitForm();
		},
		//hide菜单页
		hidePageLayer(isAnimation) {
			let tmpIndex = this.showPage;
			if (isAnimation) {
				this.confirm();
			}
			this.firstScrollInto = null;
			this.secondScrollInto = null;
		},
		//show菜单页
		showPageLayer() {
			this.processPage(0);
			this.$nextTick(() => {
				setTimeout(() => {
					this.showPage = true;
				}, 0);
			});
		},
		reloadActiveMenuArr() {
			for (let i = 0; i < this.filterData.length; i++) {
				let tmpitem = this.filterData[i];
				let tmpArr = this.processActive(tmpitem);
				tmpitem = this.processSubMenu(tmpitem);
				if (this.activeMenuArr[i].length != tmpArr.length) {
					this.filterData[i] = tmpitem;
					this.activeMenuArr.splice(i, 1, JSON.parse(JSON.stringify(tmpArr)));
					this.shadowActiveMenuArr.splice(i, 1, JSON.parse(JSON.stringify(tmpArr)));
				}
			}
			this.subData = this.filterData;
			this.$forceUpdate();
		},
		processSubMenu(menu) {
			if (menu.hasOwnProperty('children') && menu.children.length > 0) {
				for (let i = 0; i < menu.children.length; i++) {
					menu.children[i] = this.processSubMenu(menu.children[i]);
				}
			} else {
				menu.children = [];
			}
			return menu;
		},
		processActive(tmpitem) {
			let tmpArr = [];
			let level = this.getMaxFloor(tmpitem.children);
			while (level > 0) {
				tmpArr.push(null);
				level--;
			}
			return tmpArr;
		},
		processPage(index) {
			//check UI控制数组，结果数组,防止传入数据层级和UI控制数组不同步
			this.reloadActiveMenuArr();
			this.$nextTick(() => {
				setTimeout(() => {
					//滚动到选中项
					this.firstScrollInto = parseInt(this.activeMenuArr[index][0]);
					this.secondScrollInto = parseInt(this.activeMenuArr[index][1]);
				}, 0);
			});
		},
		//计算菜单层级
		getMaxFloor(treeData) {
			let floor = 0;
			let max = 0;
			function each(data, floor) {
				data.forEach(e => {
					max = floor > max ? floor : max;
					if (e.hasOwnProperty('children') && e.children.length > 0) {
						each(e.children, floor + 1);
					}
				});
			}
			each(treeData, 1);
			return max;
		},
		//展开更多
		showMoreSub(index) {
			this.subData[this.showPage].children[this.activeMenuArr[this.showPage][0]].children[index].showAllSub = true;
			this.$forceUpdate();
		},
		//选中
		selectHierarchyMenu(page_index, level1_index, level2_index, level3_index) {
			//读取记录
			if (level1_index != null && level2_index == null && level3_index == null && this.shadowActiveMenuArr[page_index][0] == level1_index) {
				this.activeMenuArr.splice(page_index, 1, JSON.parse(JSON.stringify(this.shadowActiveMenuArr[page_index])));
			} else {
				this.activeMenuArr[page_index].splice(0, 1, level1_index);
				((level2_index != null || this.activeMenuArr[page_index].length >= 2) && this.activeMenuArr[page_index].splice(1, 1, level2_index)) ||
					this.activeMenuArr[page_index].splice(1, 1);
				((level3_index != null || this.activeMenuArr[page_index].length >= 3) && this.activeMenuArr[page_index].splice(2, 1, level3_index)) ||
					this.activeMenuArr[page_index].splice(2, 1);
			}
			//写入结果
			if (level3_index != null || level2_index != null || (level1_index != null && this.subData[page_index].children[level1_index].children.length == 0)) {
				let sub = this.subData[page_index].children[level1_index].children[level2_index];
				if (this.updateMenuName) {
					this.menu[page_index].name =
						(level3_index != null && sub.children[level3_index].name) || (level2_index != null && sub.name) || this.subData[page_index].children[level1_index].name;
				}
				this.shadowActiveMenuArr[page_index] = JSON.parse(JSON.stringify(this.activeMenuArr[page_index]));
				this.togglePage(this.showPage);
			}
		},
		//写入结果，筛选
		setFilterData(page_index) {
			this.shadowActiveMenuArr[page_index] = JSON.parse(JSON.stringify(this.activeMenuArr[page_index]));
			this.togglePage(this.showPage);
		},
		//重置结果和ui，筛选
		resetFilterData(page_index) {
			let tmpArr = [];
			let level = this.shadowActiveMenuArr[page_index].length;
			while (level > 0) {
				tmpArr.push([]);
				let box = this.subData[page_index].children[level - 1].children;
				for (let i = 0; i < box.length; i++) {
					this.subData[page_index].children[level - 1].children[i].selected = false;
				}
				level--;
			}
			this.activeMenuArr[page_index] = JSON.parse(JSON.stringify(tmpArr));
			this.$forceUpdate();
		},
		//选中筛选类label-UI状态
		selectFilterLabel(page_index, box_index, label_index) {
			let find_index = this.activeMenuArr[page_index][box_index].indexOf(label_index);
			if (find_index > -1) {
				this.activeMenuArr[page_index][box_index].splice(find_index, 1);
				this.subData[page_index].children[box_index].children[label_index].selected = false;
			} else {
				this.activeMenuArr[page_index][box_index].push(label_index);
				this.subData[page_index].children[box_index].children[label_index].selected = true;
			}
			this.$forceUpdate();
		},
		//选中单选类label-UI状态
		selectRadioLabel(page_index, box_index, label_index) {
			let activeIndex = this.activeMenuArr[page_index][box_index][0];
			if (activeIndex == label_index) {
				this.subData[page_index].children[box_index].children[activeIndex].selected = false;
				this.activeMenuArr[page_index][box_index][0] = null;
			} else {
				if (activeIndex != null && activeIndex < this.subData[page_index].children[box_index].children.length) {
					this.subData[page_index].children[box_index].children[activeIndex].selected = false;
				}

				this.subData[page_index].children[box_index].children[label_index].selected = true;
				this.activeMenuArr[page_index][box_index][0] = label_index;
			}
			this.$forceUpdate();
		},
		getClassfly() {
			getCategory().then(res => {
				this.filterData = [
					{
						name: '这是标题',
						type: 'hierarchy',
						children: res.data
					}
				];
			});
		},
		//hide遮罩层
		hideMask() {
			this.isShowMask = false;
			setTimeout(() => {
				this.maskVisibility = false;
			}, 200);
		},
		//show遮罩层
		showMask() {
			this.maskVisibility = true;
			this.$nextTick(() => {
				setTimeout(() => {
					this.isShowMask = true;
				}, 0);
			});
		},
		//菜单开关
		togglePage() {
			if (this.showPage) {
				this.showPage = false;
				this.hideMask();
				this.hidePageLayer(true);
			} else {
				this.showPageLayer();
				this.showPage = true;
				this.showMask();
			}
		},
		changeRecommendLoading(recommendLoading) {
			this.recommendLoading = recommendLoading;
		},
		goGoodsCon(item) {
			this.$yrouter.push({
				path: '/pages/shop/GoodsCon/index',
				query: {
					id: item.id,
					type: this.type,
					isIntegral: this.isIntegral
				}
			});
		},
		goIntegralGoodsCon(item) {
			this.$yrouter.push({
				path: '/pages/shop/IntegralGoodsCon/index',
				query: {
					id: item.id,
					isIntegral: this.isIntegral
				}
			});
		},
		updateTitle() {
			uni.setNavigationBarTitle({
				title: this.title
			});
			// document.title = this.title || this.$yroute.meta.title;
		},
		getProductList() {
			var that = this;
			this.setWhere();
			// if (to.name !== "GoodsList") return;
			const { s = '', id = 0, title = '' } = this.$yroute.query;
			if (s !== this.where.keyword || id !== this.where.sid) {
				this.loadend = false;
				this.loading = false;
				this.where.page = 1;
				/* this.where.sid = id; */
				/* this.title = title && id ? title : ''; */
				this.nows = false;
				this.$set(this, 'productList', []);
				this.price = 0;
				this.stock = 0;
				// this.getProductList();
			}
			let q = that.where;
			let getData = this.isIntegral !== 'true' ? getProducts : getProductsIntegral;
			getData(q).then(res => {
				that.loading = false;
				if (that.target) {
					that.productList = res.data;
				} else {
					that.productList.push.apply(that.productList, res.data);
				}
				that.target = false;
				that.loadend = res.data.length < that.where.limit; //判断所有数据是否加载完成；
				that.where.page = that.where.page + 1;
			});
		},
		submitForm: function() {
			this.$set(this, 'productList', []);
			this.where.page = 1;
			this.loadend = false;
			this.loading = false;
			this.getProductList();
		},
		//点击事件处理
		set_where: function(index) {
			let that = this;
			switch (index) {
				case 0:
					uni.switchTab({
						url: '/pages/home/GoodsClass/index'
					});
					break;
				/* return that.$yrouter.push({
					path: '/pages/home/GoodsClass/index',
				  }) */
				case 1:
					if (that.price === 0) that.price = 1;
					else if (that.price === 1) that.price = 2;
					else if (that.price === 2) that.price = 0;
					that.stock = 0;
					break;
				case 2:
					if (that.stock === 0) that.stock = 1;
					else if (that.stock === 1) that.stock = 2;
					else if (that.stock === 2) that.stock = 0;
					that.price = 0;
					break;
				case 3:
					that.nows = !that.nows;
					break;
				default:
					break;
			}
			this.productList = [];
			that.$set(that, 'productList', []);
			that.where.page = 1;
			that.target = true;
			that.loadend = false;
			that.getProductList();
		},
		//设置where条件
		setWhere: function() {
			let that = this;
			if (that.price === 0) {
				that.where.priceOrder = '';
			} else if (that.price === 1) {
				that.where.priceOrder = 'asc';
			} else if (that.price === 2) {
				that.where.priceOrder = 'desc';
			}
			if (that.stock === 0) {
				that.where.salesOrder = '';
			} else if (that.stock === 1) {
				that.where.salesOrder = 'asc';
			} else if (that.stock === 2) {
				that.where.salesOrder = 'desc';
			}
			that.where.news = that.nows ? '1' : '0';
		},
		switchTap: function() {
			let that = this;
			that.Switch = !that.Switch;
		}
	}
};
</script>
<style scoped lang="scss">
.HMfilterDropdown {
	flex-shrink: 0;
	width: 100%;
	position: fixed;
	// position: sticky;
	z-index: 997;
	flex-wrap: nowrap;
	display: flex;
	flex-direction: row;
	top: var(--window-top);
	left: 0;
	// top:100px;
	overflow-y: hidden;
	&.setDropdownBottom {
		// height: 345px;
		bottom: 0;
	}
	view {
		display: flex;
		flex-wrap: nowrap;
	}
}
.region {
	flex: 1;
	height: 44px;
}
.nav {
	width: 100%;
	height: 44px;
	border-bottom: solid 1rpx #eee;
	z-index: 12;
	background-color: #ffffff;
	flex-direction: row;
	.first-menu {
		font-size: 13px;
		color: #757575;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		transition: color 0.2s linear;

		&.on {
			color: #ec652b;

			.iconfont {
				color: #ec652b;
			}
		}
		.name {
			height: 20px;
			text-align: center;
			text-overflow: clip;
			overflow: hidden;
		}
		.iconfont {
			width: 13px;
			height: 13px;
			align-items: center;
			justify-content: center;
			transition: transform 0.2s linear, color 0.2s linear;
		}
	}
}
.sub-menu-class {
	width: 100%;
	position: fixed;
	left: 0;
	transform: translate3d(0, -100%, 0);
	max-height: 345px;
	background-color: #ffffff;
	z-index: 11;
	box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	flex-direction: row;
	display: flex;
	transition: transform 0.15s linear;
	&.hide {
		display: none;
	}

	&.show {
		transform: translate3d(0, calc(15rpx + 1rpx), 0);
	}
}
.sub-menu-list {
	width: 100%;
	height: 345px;
	flex-direction: column;
	.sub-menu {
		min-height: 44px;
		font-size: 13px;
		flex-direction: column;
		padding-right: 15px;
		> .menu-name {
			height: 44px;
			line-height: 44px;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			> .iconfont {
				display: none;
				font-size: 18px;
				color: #ec652b;
			}
		}
	}
	&.not-first {
		.sub-menu {
			min-height: calc(44px - 1rpx);
			margin-left: 15px;
			border-bottom: solid 1rpx #e5e5e5;
			> .menu-name {
				height: calc(44px - 1rpx);
				> .iconfont {
					display: none;
					font-size: 18px;
					color: #ec652b;
				}
			}
			&.on {
				color: #ec652b;
				> .menu-name {
					> .iconfont {
						display: block;
					}
				}
			}
			.more-sub-menu {
				flex-direction: row;
				flex-wrap: wrap;
				padding-bottom: 9px;
				> text {
					height: 30px;
					border-radius: 3px;
					background-color: #f5f5f5;
					color: #9b9b9b;
					margin-bottom: 6px;
					margin-right: 6px;
					text-align: center;
					line-height: 30px;
					border: solid #f5f5f5 1rpx;
					flex: 0 0 calc(33.33% - 6px);
					overflow: hidden;
					font-size: 12px;
					&:nth-child(3n) {
						margin-right: 0;
					}
					&.on {
						border-color: #f6c8ac;
						color: #ec652b;
					}
					.iconfont {
						color: #9b9b9b;
					}
				}
			}
		}
	}
	&.first {
		flex-shrink: 0;
		width: 236rpx;
		background-color: #f0f0f0;
		.sub-menu {
			padding-left: 15px;

			&.on {
				background-color: #fff;
			}
		}
	}
	&.alone {
		max-height: 345px;
		min-height: 170px;
		height: auto;
		.sub-menu {
			min-height: calc(44px - 1rpx);
			margin-left: 15px;
			border-bottom: solid 1rpx #e5e5e5;

			&.on {
				color: #ec652b;

				> .menu-name {
					> .iconfont {
						display: block;
					}
				}
			}
		}
	}
	
}
.filter {
	width: 100%;
	height: 345px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	.menu-box {
		width: 698rpx;
		height: calc(345px - 75px);
		flex-shrink: 1;
		.box {
			width: 100%;
			margin-top: 16px;
			flex-direction: column;
			.title {
				width: 100%;
				font-size: 13px;
				color: #888;
			}
			.labels {
				flex-direction: row;
				flex-wrap: wrap;
				.on {
					border-color: #ec652b;
					background-color: #ec652b;
					color: #fff;
				}
				> view {
					width: 148rpx;
					height: 30px;
					border: solid 1rpx #adadad;
					border-radius: 2px;
					margin-right: 15px;
					margin-top: 8px;
					font-size: 12px;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					&:nth-child(4n) {
						margin-right: 0;
					}
				}
			}
		}
	}
	.btn-box {
		flex-shrink: 0;
		width: 698rpx;
		height: 75px;
		flex-direction: row !important;
		align-items: center;
		justify-content: space-between;
		> view {
			width: 320rpx;
			height: 40px;
			border-radius: 40px;
			border: solid 1rpx #ec652b;
			align-items: center;
			justify-content: center;
		}
		.reset {
			color: #ec652b;
		}
		.submit {
			color: #fff;
			background-color: #ec652b;
		}
	}
}
.mask {
	z-index: 10;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0);
	transition: background-color 0.15s linear;
	&.show {
		background-color: rgba(0, 0, 0, 0.5);
	}
	&.hide {
		display: none;
	}
}
/* 字体图标 */
@font-face {
	font-family: 'HM-FD-font';
	src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAALAAAsAAAAABpQAAAJzAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgp4gQIBNgIkAwwLCAAEIAWEbQc5G8sFERWMIbIfCbbzqA4hp7InSBibVsYGb4J42o82b3e/nJlHMw/NHbGOlwKJRCRpwzPtpAECCOZubdqxjYpQLMlVg+70/08edrgQOtx2ukpVyApZn+dyehPoQObHo3O85rYx9vOjXoBxQIHugW2yIkqIW2QXcScu4jwE8CSWbKSmrqUHFwOaJoCsLM5P4haSGIxRcRHshrUGucLCVcfqI3AZfV/+USguKCwNmtsxVztDxU/n55C+3W0Z4QQpEOTNFqCBbMCAjDUWB9CIwWk87aa70cYgqLkyd3dEmm+18R8eKATEBrV7A5CulBT8dKiWOYZk412XNcDdKSEKSGODnyKIDl+dmVt9/Dx4pu/xyeutkMlHISGPTsPCnoTNP9nOT6wTtDdlO6dPr47efvj942lkYuQzrhMKEjq9N6y98P3340gmlJ/RStUD6F31CAEEPtUW94/7rf+7XgaAz57X0ZHXAGsFFwVgw38yALuMb0IBbVyNamFYEw4oKMDTj3AHRQP5Pt4dci9VwSVkRNQh5r7CLskZadhsWHhRDBsXczk8ZYk3ewnCxmQeQKa3BOHvA8XXO2j+vqRhf7CE+sPmn4anvoL29JLa4qqaUQkmoK+QG2osCckq7txi2leK86aIPyJ3eQZ8xytXYmyQ51jQndJAxIJlqiGSLsOqImiZCjTiZCJt6Lq26U2OoXqwUo0hRaAE0K5AziANy/uLVeXzWyjVqyjcoeupjxDr5MMDn8MDkLG9Aenu5ZrOSSoghAUsRmogkkahSoWAtnlUARnCkY3It0Iu7mWhdmd9Z/19BwBP6GidEi0G56opckXTGZVSPxgAAAA=');
}
.iconfont {
	font-family: 'HM-FD-font' !important;
	font-size: 13px;
	font-style: normal;
	color: #757575;
	&.triangle {
		&:before {
			content: '\e65a';
		}
	}
	&.selected {
		float: left;
		&:before {
			content: '\e607';
		}
	}
}
	</style>
<style scoped lang="less">

.noCommodity {
	border-top: 3px solid #f5f5f5;
	padding-bottom: 1px;
}

.tui-product-list {
	display: flex;
	box-sizing: border-box;
	margin-top: 1.72 * 100rpx;
}

.tui-product-container {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	flex: 1;
	justify-content: space-between;
}

.tui-product-container:last-child {
	margin-right: 0;
}

.tui-pro-item {
	flex: 0 0 49%;
	margin-bottom: 10rpx;
	background: #fff;
	box-sizing: border-box;
	border-radius: 12rpx;
	overflow: hidden;
	transition: all 0.15s ease-in-out;
}

.tui-flex-list {
	flex: 1 1 100%;
	display: flex;
	margin-bottom: 1rpx !important;
}

.tui-pro-img {
	width: 100%;
	display: block;
}

.tui-proimg-list {
	width: 260rpx;
	height: 260rpx !important;
	flex-shrink: 0;
	border-radius: 12rpx;
}

.tui-pro-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 20rpx;
}
.tip {
	width: 100%;
	line-height: 56rpx;
	background: rgba(246, 242, 234, 1);
	font-size: 22rpx;
	font-family: PingFang SC;
	font-weight: 400;
	color: rgba(168, 112, 13, 1);
	padding: 0 20rpx;
}
.tui-pro-tit {
	color: #2e2e2e;
	font-size: 26rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.tui-pro-price {
	padding-top: 18rpx;
}

.tui-sale-price {
	font-size: 34rpx;
	font-weight: 500;
	color: #e41f19;
}

.tui-factory-price {
	font-size: 24rpx;
	color: #a0a0a0;
	text-decoration: line-through;
	padding-left: 12rpx;
}

.tui-pro-pay {
	padding-top: 10rpx;
	font-size: 24rpx;
	color: #656565;
}
/* 商品列表*/
</style>
