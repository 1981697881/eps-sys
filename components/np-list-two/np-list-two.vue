<template>
	<view class="np-goods-list">
		<view class="np-goods-container">
			<view class="np-goods-box shadow" v-for="(item,index) in goodsList" :key="index" v-if="(index+1)%2!=0" @click="navTo(index)">
				<view class="goods-image-box">
					<image lazy-load="true" :src="item.image" class="goods-image" mode="widthFix" />
					<view class="image-top-box">
						<view class="tip-box" v-for="(item,index) in item.tip" :key="index" v-if="index < 3">
							<text class="tip-tags" :class="item.color ? 'bg-' + item.color : 'bg-red'">{{item.name}}</text>
						</view>
					</view>
					<view class="image-bottom-box">
						<view class="tip-mall text-white text-center" v-if="item.shop_type == 1">
							<text>{{item.shop_name}}</text>
						</view>
					</view>
				</view>
				<view class="np-goods-content">
					<view class="np-goods-title more-line margin-bottom-xs">
						<text v-for="(item,index) in item.tags" :key="index" class="np-goods-tag" :class="item.color ? 'bg-' + item.color : 'bg-red'">{{item.name}}</text>
						<text class="pd-left">{{item.title}}</text>
					</view>
					<view class="np-goods-coupon-price">
						<text>{{item.coupon_price}}</text>
						<text class="np-price-first" v-if="item.price_name">{{item.price_name}}</text>
					</view>
					<!-- <view class="np-goods-money-box">
						<view class="np-money-item" v-if="item.coupon_quan">
							<text class="np-money-item-left">券</text>
							<text class="np-money-item-right">{{item.coupon_quan}}元</text>
						</view>
						<text class="np-goods-sales">{{item.sales + '人付款'}}</text>
					</view> -->
				</view>
				<!-- #ifdef H5 -->
				<view class="np-goods-bottom bg-gradual-orange-1" v-if="item.money > 0">
					<text class="npIcon-fenxiang1"></text>
					<text class="np-goods-bottom-text">赚</text>
					<text class="np-share-money">{{item.money + '元'}}</text>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN||MP-QQ -->
				<view class="np-goods-bottom bg-gradual-orange-1" v-if="item.money > 0 && globalConfig.wechat_mod == 1">
					<text class="npIcon-fenxiang1"></text>
					<text class="np-goods-bottom-text">赚</text>
					<text class="np-share-money">{{item.money + '元'}}</text>
				</view>
				<!-- #endif -->
			</view>
		</view>
		<view class="np-goods-container">
			<view class="np-goods-box shadow" v-for="(item,index) in goodsList" :key="index" v-if="(index+1)%2==0" @click="navTo(index)">
				<view class="goods-image-box">
					<image lazy-load="true" :src="item.image" class="goods-image" mode="widthFix" />
					<view class="image-top-box">
						<view class="tip-box" v-for="(item,index) in item.tip" :key="index" v-if="index < 3">
							<text class="tip-tags" :class="item.color ? 'bg-' + item.color : 'bg-red'">{{item.name}}</text>
						</view>
					</view>
					<view class="image-bottom-box">
						<view class="tip-mall text-white text-center" v-if="item.shop_type == 1">
							<text>{{item.shop_name}}</text>
						</view>
					</view>
				</view>
				<view class="np-goods-content">
					<view class="np-goods-title more-line margin-bottom-xs">
						<text v-for="(item,index) in item.tags" :key="index" class="np-goods-tag" :class="item.color ? 'bg-' + item.color : 'bg-red'">{{item.name}}</text>
						<text class="pd-left">{{item.title}}</text>
					</view>
					
					<view class="np-goods-coupon-price">
						<text>{{item.coupon_price}}</text>
						<text class="np-price-first" v-if="item.price_name">{{item.price_name}}</text>
					</view>
					<!-- <view class="np-goods-money-box">
						<view class="np-money-item" v-if="item.coupon_quan">
							<text class="np-money-item-left">券</text>
							<text class="np-money-item-right">{{item.coupon_quan}}元</text>
						</view>
						<text class="np-goods-sales">{{item.sales + '人付款'}}</text>
					</view> -->
				</view>
				<!-- #ifdef H5 -->
				<view class="np-goods-bottom bg-gradual-orange-1" v-if="item.money > 0">
					<text class="npIcon-fenxiang1"></text>
					<text class="np-goods-bottom-text">赚</text>
					<text class="np-share-money">{{item.money + '元'}}</text>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN||MP-QQ -->
				<view class="np-goods-bottom bg-gradual-orange-1" v-if="item.money > 0 && globalConfig.wechat_mod == 1">
					<text class="npIcon-fenxiang1"></text>
					<text class="np-goods-bottom-text">赚</text>
					<text class="np-share-money">{{item.money + '元'}}</text>
				</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "npListTwo",
		props: {
			goodsList: {
				type: Array,
				default: () => {
					return [];
				}
			},
			isList: {
				type: Boolean,
				default: true
			},
			api: {
				type: String,
				default: ''
			}
		},
		methods: {
			navTo(index) {
				let that = this
				let item = this.goodsList[index];
				console.log(item)
				uni.setStorage({
					key: 'ITEM',
					data: JSON.stringify(item),
					success: () => {
						this.$yrouter.push({
						  path: item.to_page,
						  query: {
							  id: 6,
							  isIntegral: false,
							  type: "3"
						  },
						})
						/* uni.navigateTo({
							url: item.to_page
						}); */
					}
				});
			}
		}
	}
</script>

<style>
	.np-goods-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 20rpx;
	}
	
	.np-goods-container {
		width: 49%;
		margin-top: 20rpx;
	}

	.np-goods-box {
		width: 100%;
		display: flex;
		flex-direction: column;
		border-radius: 16rpx;
		overflow: hidden;
		background: #FFFFFF;
		margin-bottom: 16rpx;
	}

	.goods-image-box {
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	.goods-image {
		width: 100%;
	}

	.image-top-box {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.tip-box {
		line-height: 30rpx;
	}

	.tip-tags {
		line-height: 30rpx;
		padding: 0 10rpx;
		font-size: 20rpx;
		border-top-right-radius: 6rpx;
		border-bottom-right-radius: 6rpx;
	}

	.border-r {
		border-top-right-radius: 12rpx;
	}

	.image-bottom-box {
		position: absolute;
		bottom: 0;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.tip-mall {
		width: 100%;
		padding: 5rpx 10rpx;
		font-size: 20rpx;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.np-goods-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 15rpx;
	}

	.np-goods-title {
		font-size: 30rpx;
		line-height: 40rpx;
		position: relative;
	}

	.np-goods-tag {
		font-size: 22rpx;
		font-weight: 600;
		padding: 0 8rpx;
		height: 30rpx;
		line-height: 30rpx;
		border-radius: 6rpx;
		margin-right: 5rpx;
		vertical-align: middle;
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		margin-top: -6.09rpx;
	}

	.pd-left {
		padding-left: 5rpx;
	}

	.np-goods-coupon-price {
		font-size: 40rpx;
		font-weight: bold;
		color: #e54d42;
	}

	.np-goods-coupon-price::before {
		content: "¥";
		font-size: 70%;
		margin-right: 4upx;
	}

	.np-goods-sales {
		font-size: 24rpx;
		color: #AAAAAA;
		font-weight: normal;
	}

	.np-goods-money-box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.np-money-item {
		font-size: 20rpx;
		height: 30rpx;
		line-height: 30rpx;
		border-radius: 6rpx;
		border: 1rpx #ff5000 solid;
		color: #ff5000;
		margin-right: 5rpx;
	}

	.np-money-item-left {
		text-align: center;
		padding: 0 6rpx;
		background-color: #fff1eb;
		border-right: 1rpx #ff5000 dotted;
	}

	.np-money-item-right {
		text-align: center;
		padding: 0 6rpx;
	}

	.np-goods-bottom {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #FFFFFF;
		padding: 5rpx 0;
	}

	.np-goods-bottom-text {
		margin-right: 10rpx;
	}

	.npIcon-fenxiang1 {
		font-size: 32rpx;
		margin-right: 5rpx;
	}

	.np-share-money {
		font-size: 28rpx;
		font-weight: bold;
		color: #FFFFFF;
	}

	.np-share-money::before {
		content: "¥";
		font-size: 70%;
		margin-right: 4upx;
	}

	/*多行文本溢出省略号*/
	.more-line {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		transition: all linear 0.2s;
	}

	.np-price-first {
		margin-left: 10rpx;
		background-color: #1cbbb4;
		color: #FFFFFF;
		font-size: 22rpx;
		font-weight: 600;
		padding: 0 8rpx;
		height: 30rpx;
		line-height: 30rpx;
		border-radius: 6rpx;
		margin-right: 5rpx;
		vertical-align: middle;
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		margin-top: -6.09rpx;
	}
</style>
