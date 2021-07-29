<template>
	<view class="banner-swiper-box">
		<canvas canvas-id="colorThief" class="hide-canvas"></canvas>
		<swiper class="banner-carousel Shop-selector-rect" circular @change="swiperChange" :autoplay="true">
			<swiper-item v-for="(item, index) in detail" :key="index" class="carousel-item">
				<image class="swiper-image " :src="item.pic" @click="goRoll(item.uniapp_url)" mode="widthFix" lazy-load></image>
			</swiper-item>
		</swiper>
		<view class="banner-swiper-dots">
			<text :class="swiperCurrent === index ? 'banner-dot-active' : 'banner-dot'" v-for="(dot, index) in detail.length" :key="index"></text>
		</view>
	</view>
</template>

<script>
import colorThief from 'miniapp-color-thief';

export default {
	data() {
		return {
			swiperCurrent: 0, //轮播下标
			webviewId: 0
		};
	},
	props: {
		detail: {
			type: Array,
			default: []
		}
	},
	created: async function() {
		await this.doColorThief();
	},
	computed: {},
	methods: {
		async doColorThief() {
			let that = this;
			// 获取轮播图

			let item = this.detail[this.swiperCurrent];
			// 获取轮播图颜色
			let bgcolor = null;
			// 颜色不存在
			/* if (!bgcolor) {
					that.$set(item, 'bgcolor', '#EEB422');
					that.$emit('getbgcolor', '#EEB422');
				} else {
					that.$set(item, 'bgcolor', null);
					that.$emit('getbgcolor', null);
				} */
		},
		swiperChange(e) {
			this.swiperCurrent = e.detail.current;
			this.doColorThief();
			/* let bgcolor = this.detail[this.swiperCurrent].bgcolor;
				this.$emit('getbgcolor', bgcolor); */
		},
		// 路由跳转
		goRoll(path, params = {}, isLogin) {
			/**
			 * 跳转再封装，不支持复杂传参。
			 */
			let objParams = params;
			// 是否跳转外部链接
			if (~path.indexOf('http')) {
				// #ifdef H5
				window.location = path;
				// #endif
				// #ifndef  H5
				this.$yrouter.push({
					path: '/pages/Loading/webview',
					query: {
						webviewPath: path
					}
				});
				// #endif
				return false;
			}
			// 判断是否有参数
			if (path.indexOf('?') !== -1) {
				let index = path.lastIndexOf('?');
				let query = path.substring(index + 1, path.length);
				let arr = query.split('&');
				path = path.slice(0, index);
				arr.forEach(item => {
					let mArr = [];
					let obj = {};
					mArr = item.split('=');
					obj[mArr[0]] = mArr[1];
					objParams = {
						...objParams,
						...obj
					};
				});
			}
			// 判断是否是tabbar
			if (isLogin) {
				this.$yrouter.replaceAll({
					path: path,
					query: objParams
				});
			} else {
				this.$yrouter.push({
					path: path,
					query: objParams
				});
			}
		}
	}
};
</script>

<style lang="less">
// 轮播
.banner-swiper-box {
	background: #fff;
}

.banner-swiper-box,
.banner-carousel {
	width: 750rpx;
	height: 350upx;
	position: relative;

	.carousel-item {
		width: 100%;
		height: 100%;
		// padding: 0 28upx;
		overflow: hidden;
	}

	.swiper-image {
		width: 100%;
		height: 100%;
		// border-radius: 10upx;
		// background: #ccc;
	}
}

.banner-swiper-dots {
	display: flex;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 20rpx;
	z-index: 5;

	.banner-dot {
		width: 14rpx;
		height: 14rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.banner-dot-active {
		width: 14rpx;
		height: 14rpx;
		background: #a8700d;
		border-radius: 50%;
		margin-right: 10rpx;
	}
}

.hide-canvas {
	position: fixed !important;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}
</style>
