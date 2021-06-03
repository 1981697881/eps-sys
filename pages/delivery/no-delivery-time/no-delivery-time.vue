<template>

	<view class="no-delivery-time-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_5.png"></image>
		<view class="no-delivery-time-title-box">
			<view class="no-delivery-time-title">
				不适合派件时间
			</view>
			<view class="no-delivery-time-subtitle">
				Not Delivery Time
			</view>
		</view>
		<view class="times-box uni-flex uni-column">
			<view>
				<view class="times-title">请选择不适合配送时间段（可多选）</view>
				<view class="calendar-icon-box uni-flex uni-row">
					<image class="flex-item calendar-icon" src="/static/img/icon_7.png"></image>
					<view class="flex-item calendar-icon-text">工作日</view>
				</view>
				<view class="type-title color999">上午派送时间段</view>
				<view class="time-item-box">
					<view @click="selectItem(item)" v-bind:key="index" :class="item.select?'time-item time-item-select':'time-item'"
					 v-for="(item,index) in times.weekdaysMorning">
						{{item.times}}
						<image v-if="item.select" class="time-item-select-icon" src="/static/img/icon_8.png"></image>
					</view>
				</view>
				<view class="type-title color999" style="margin-top: 20rpx;">下午派送时间段</view>
				<view class="time-item-box">
					<view @click="selectItem(item)" v-bind:key="index" :class="item.select?'time-item time-item-select':'time-item'"
					 v-for="(item,index) in times.weekdaysAfternoon">
						{{item.times}}
						<image v-if="item.select" class="time-item-select-icon" src="/static/img/icon_8.png"></image>
					</view>
				</view>
				<view class="calendar-icon-box uni-flex uni-row" style="margin-top: 30rpx;">
					<image class="flex-item calendar-icon" src="/static/img/icon_7.png"></image>
					<view class="flex-item calendar-icon-text">节假日</view>
				</view>
				<view class="type-title color999">上午派送时间段</view>
				<view class="time-item-box">
					<view @click="selectItem(item)" v-bind:key="index" :class="item.select?'time-item time-item-select':'time-item'"
					 v-for="(item,index) in times.holidayMorning">
						{{item.times}}
						<image v-if="item.select" class="time-item-select-icon" src="/static/img/icon_8.png"></image>
					</view>
				</view>
				<view class="type-title color999" style="margin-top: 20rpx;">下午派送时间段</view>
				<view class="time-item-box">
					<view @click="selectItem(item)" v-bind:key="index" :class="item.select?'time-item time-item-select':'time-item'"
					 v-for="(item,index) in times.holidayAfternoon">
						{{item.times}}
						<image v-if="item.select" class="time-item-select-icon" src="/static/img/icon_8.png"></image>
					</view>
				</view>
				<view style="height: 50rpx;width: 100%;"></view>

			</view>
		</view>
		<view class="content-bg">
			<button :class="defineButtonClassName" type="warn" @click="confirm">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defineButtonClassName: 'define-button',
				times: {
					weekdaysMorning: [],
					weekdaysAfternoon: [],
					holidayMorning: [],
					holidayAfternoon: []
				}
			};
		},
		onLoad(option) {
			let vm = this;
			vm.pageFlag = option.pageFlag
			console.log(vm.pageFlag)
			vm.loadWeekdaysHolidayList();
			
		},
		methods: {
			selectTimes(selected, target) {
				for (var i = 0; i < selected.length; i++) {
					for (var j = 0; j < target.length; j++) {
						if (target[j].code === selected[i].code) {
							target[j].select = true;
						}
					}
				}
			},
	
			confirm() {
				let vm = this;
				// 工作日的code
				let weekdays = [];
				for (var i = 0; i < vm.times.weekdaysMorning.length; i++) {
					if (vm.times.weekdaysMorning[i].select) {
						weekdays.push(vm.times.weekdaysMorning[i])
					}
				}
				for (var i = 0; i < vm.times.weekdaysAfternoon.length; i++) {
					if (vm.times.weekdaysAfternoon[i].select) {
						weekdays.push(vm.times.weekdaysAfternoon[i])
					}
				}
				// 节假日的code
				let holiday = [];
				for (var i = 0; i < vm.times.holidayMorning.length; i++) {
					if (vm.times.holidayMorning[i].select) {
						holiday.push(vm.times.holidayMorning[i])
					}
				}
				for (var i = 0; i < vm.times.holidayAfternoon.length; i++) {
					if (vm.times.holidayAfternoon[i].select) {
						holiday.push(vm.times.holidayAfternoon[i])
					}
				}
				let obj = {
					weekdays: weekdays,
					holiday: holiday
				};
				// 储存
				vm.$store.dispatch("addNoDeliveryTime", obj);
					console.log("NoDeliveryTime")
				console.log(vm.$store.getters.getNoDeliveryTime)
			

				// 跳转
				 let pages = getCurrentPages(); // 当前页面
				 let beforePage = pages[pages.length - 2]; // 前一个页面
				 uni.navigateBack({
					 success: function() {
						 beforePage.onLoad(); // 执行前一个页面的onLoad方法
					 }
				 });
			},
			loadWeekdaysHolidayList() {
				let vm = this;
				uni.request({
					url: vm.$api.deliveryTime.weekdaysHolidayList,
					data: {},
					header: {},
					success: (res) => {
						vm.times = res.data.data.times;
						vm.setDefineButtonMargin();
						let noDeliveryTime = vm.$store.getters.getNoDeliveryTime;
						console.log(noDeliveryTime)
						if (noDeliveryTime) {
							vm.selectTimes(noDeliveryTime.weekdays, vm.times.weekdaysMorning)
							vm.selectTimes(noDeliveryTime.weekdays, vm.times.weekdaysAfternoon)
							vm.selectTimes(noDeliveryTime.holiday, vm.times.holidayMorning)
							vm.selectTimes(noDeliveryTime.holiday, vm.times.holidayAfternoon)
							
						}
					}
				})
			},
			selectItem(item) {
				item.select = !item.select
			},
			setDefineButtonMargin() {
				let vm = this;
				let classNames = 'define-button'
				console.log(vm.times)
				let ml = (vm.times && vm.times.weekdaysMorning && vm.times.weekdaysMorning.length) ? vm.times.weekdaysMorning.length :
					3;
				let al = (vm.times && vm.times.weekdaysAfternoon && vm.times.weekdaysAfternoon.length) ? vm.times.weekdaysAfternoon
					.length : 3;

				console.log(ml)
				console.log(al)

				// 两个大于6个
				if (ml > 6 && al > 6) {
					classNames = 'define-button define-button-d-gt6';
				} else if ((ml > 6 && al <= 3) || (al > 6 && ml <= 3)) {
					// 一个大于六另外一个小于等于三
					classNames = 'define-button define-button-s-gt6';
				} else if ((ml > 6 && al > 3 && al <= 6) || (al > 6 && ml > 3 && ml <= 6)) {
					// 一个大于六另一个大于三小于六
					classNames = 'define-button define-button-d-gt36';
				} else if (al > 3 && al <= 6 && ml > 3 && ml <= 6) {
					// 两个大于三小于六
					classNames = 'define-button define-button-d-gt3';
				} else if ((al > 3 && al <= 6 && ml <= 3) || ml > 3 && ml <= 6 && al <= 3) {
					// 其中一大于三小于六另外一个小于等于三
					classNames = 'define-button define-button-s-gt3';
				}
				vm.defineButtonClassName = classNames;
			}
		}
	}
</script>

<style lang="scss">
	.no-delivery-time-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #282828;
		background-color: #EDF1F5;

		.color999 {
			color: #999999;
		}

		.color28 {
			color: #282828;
		}

		.colorDE1111 {
			color: #DE1111;
		}

		.content-bg {
			background-color: #EDF1F5;
			width: 100%;

			.define-button {
				margin: 1043rpx 24rpx 168rpx 24rpx;
				background-color: #DE1111;
				font-size: 36rpx;
				border-radius: 6px;
				width: 702rpx;
				height: 98rpx;
			}

			.define-button-s-gt3 {
				margin: 1207rpx 24rpx 168rpx 24rpx;
			}

			.define-button-s-gt6 {
				margin: 1371rpx 24rpx 168rpx 24rpx;
			}

			.define-button-d-gt3 {
				margin: 1371rpx 24rpx 168rpx 24rpx;
			}

			.define-button-d-gt36 {
				margin: 1535rpx 24rpx 168rpx 24rpx;
			}

			.define-button-d-gt6 {
				margin: 1699rpx 24rpx 168rpx 24rpx;
			}
		}

		.head-img {
			width: 750rpx;
			height: 460rpx;
		}

		.times-box {
			display: flex;
			background-color: #FFFFFF;
			position: absolute;
			top: 320rpx;
			font-size: 32rpx;

			.times-title {
				font-weight: bold;
				color: #282828;
				line-height: 45rpx;
				// height: 45rpx;
				margin: 40rpx 95rpx;
				display: flex;
			}

			.calendar-icon-box {
				display: flex;
				height: 100rpx;
				background-color: #F5F5F5;

				.calendar-icon {
					width: 30rpx;
					height: 30rpx;
					margin: 35rpx 0 35rpx 41rpx;
				}

				.calendar-icon-text {
					padding: 30rpx 0 30rpx 28rpx;
					height: 40rpx;
					line-height: 40rpx;
					font-size: 28rpx;
				}
			}

			.type-title {
				margin: 30rpx 0 30rpx 40rpx;
				height: 33rpx;
				font-size: 24rpx;
				line-height: 33rpx;
			}

			.time-item-box {
				width: 702rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;

				.time-item {
					border-radius: 8rpx;
					width: 200rpx;
					height: 72rpx;
					font-size: 28rpx;
					text-align: center;
					line-height: 72rpx;
					background-color: #F5F5F5;
					color: #333333;
					margin: 0 5rpx 10rpx 5rpx;
					position: relative;
				}

				.time-item:nth-child(3n+1) {
					margin-left: 42rpx;
				}

				.time-item-select {
					background-color: #FFE7E7;
					color: #DE1111;
				}

				.time-item-select-icon {
					z-index: 99;
					width: 39rpx;
					height: 33rpx;
					position: absolute;
					bottom: 0;
					right: 0;
				}
			}
		}

		.no-delivery-time-title-box {
			position: absolute;
			top: 100rpx;
			left: 24rpx;
			text-align: left;
			color: #FFFFFF;

			.no-delivery-time-title {
				font-size: 46rpx;
				margin-bottom: 10rpx;
			}

			.no-delivery-time-subtitle {
				font-size: 36rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>
