<template>
	<view>
		<view class="np-goods" v-for="(item,index) in goodsList" :key="index">
			<view class="np-one-col-goods" @click="navTo(index)">
				<view class="np-goods-image-box">
					<image :lazy-load="true" class="np-goods-img" :src="item.image" mode="aspectFill"></image>
				</view>
				<view class="np-goods-right-box">
					<view class="np-goods-title more-line">
						<text v-for="(item,index) in item.tags" :key="index" class="np-goods-tag" :class="item.color ? 'bg-' + item.color : 'bg-red'">{{item.name}}</text>
						<text class="pd-left">{{item.title}}</text>
					</view>
					<view class="np-goods-tip one-line" v-if="showTip && item.tip.length > 0">
						<text v-for="(item,index) in item.tip" :key="index" class="np-goods-tip-margin" :class="item.color ? 'text-' + item.color : ''">{{item.name}}</text>
					</view>
					<slot name="sell"></slot>
					<view class="np-goods-price-box">
						<view class="np-goods-coupon-price">
							<text>{{item.coupon_price}}</text>
							<slot name="price"></slot>
							<text class="np-price-first" v-if="item.price_name">{{item.price_name}}</text>
						</view>
						<view class="np-goods-money-box">
							<view class="np-money-item" v-if="item.coupon_quan">
								<text class="np-money-item-left">券</text>
								<text class="np-money-item-right">{{item.coupon_quan}}元</text>
							</view>
							<view class="np-money-item" v-if="item.coupon_tags_name">
								<text class="np-money-item-left">{{item.coupon_tags_name}}</text>
								<text class="np-money-item-right">{{item.coupon_tags_price + '元'}}</text>
							</view>
							<!-- #ifdef H5 -->
							<view class="np-money-item" v-if="item.money > 0">
								<text class="np-money-item-left">赚</text>
								<text class="np-money-item-right">{{item.money + '元'}}</text>
							</view>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN||MP-QQ -->
							<view class="np-money-item" v-if="item.money > 0 && globalConfig.wechat_mod == 1">
								<text class="np-money-item-left">赚</text>
								<text class="np-money-item-right">{{item.money + '元'}}</text>
							</view>
							<!-- #endif -->
						</view>
						<view class="np-goods-footer">
							<view class="np-goods-shop">
								<text>{{item.shop_name}}</text>
							</view>
							<view class="np-goods-sales">
								<text>{{item.sales + '人付款'}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "npListOne",
		props: {
			goodsList: {
				type: Array,
				default: () => {
					return []
				}
			},
			api: {
				type: String,
				default: 'hdk'
			},
			showTip: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			navTo(index) {
				let item = this.goodsList[index];
				console.log(item)
				uni.setStorage({
					key: 'ITEM',
					data: JSON.stringify(item),
					success: () => {
						uni.navigateTo({
							url: item.to_page
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.np-goods {
		padding: 5rpx 10rpx;
	}

	.np-one-col-goods {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 20rpx;
		background: #FFFFFF;
	}

	.np-goods-image-box {
		padding: 10rpx;
		width: 300rpx;
		height: 300rpx;
		overflow: hidden;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.np-goods-img {
		width: 280rpx;
		height: 280rpx;
		border-radius: 10rpx;
		background-color: #ccc;
	}

	.np-goods-right-box {
		width: 430rpx;
		padding: 15rpx;
		height: 300rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		position: relative;
	}

	.np-goods-title {
		width: 400rpx;
		font-size: 30rpx;
		line-height: 40rpx;
		margin-bottom: 20rpx;
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

	.np-goods-tip {
		width: 400rpx;
		font-size: 24rpx;
		color: #a8700d;
	}

	.np-goods-tip-margin {
		margin-right: 10rpx;
	}

	.np-goods-price-box {
		position: absolute;
		bottom: 15rpx;
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
		margin-left: 20rpx;
		font-size: 22rpx;
		color: #AAAAAA;
		font-weight: normal;
	}

	.np-goods-money-box {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.np-money-item {
		font-size: 18rpx;
		height: 28rpx;
		line-height: 28rpx;
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
	
	.np-goods-footer {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		margin-top: 10rpx;
	}

	.np-goods-shop {
		max-width: 250rpx;
		font-size: 22rpx;
		color: #AAAAAA;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		transition: all linear 0.2s;
	}

	.pd-left {
		padding-left: 5rpx;
	}

	.one-line {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		transition: all linear 0.2s;
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
