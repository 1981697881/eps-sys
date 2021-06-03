<template>
	<view class="address-info-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_4.png"></image>
		<view class="address-info-title-box">
			<view class="address-info-title">
				{{addressInfoTitle}}
			</view>
			<view class="address-info-subtitle">
				Address Information
			</view>
		</view>

		<view class="form-box">
			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-flex  uni-row form-item">
					<view class="flex-item form-item-label">姓名</view>
					<view class="flex-item">
						<input v-model="form.name" class="uni-input form-item-input" placeholder-style="color:#999999" name="input"
						 placeholder="请输入" />
					</view>
				</view>
				<view class="form-item-border"></view>

				<view class="uni-flex  uni-row form-item">
					<view class="flex-item form-item-label">手机号码</view>
					<view class="flex-item">
						<input v-model="form.phone" class="uni-input form-item-input" placeholder-style="color:#999999" name="input"
						 placeholder="请输入" />
					</view>
				</view>
				<view class="form-item-border"></view>

				<view @click="showSelectArea" class="uni-flex  uni-row form-item">
					<view class="flex-item form-item-label">省市区</view>
					<view class="flex-item uni-row form-item-arrow">
						<text class="form-item-arrow-text color999" v-if="!form.selectAreaName">请选择</text>
						<text v-else class="form-item-arrow-text">{{form.selectAreaName}}</text>
						<image class="form-icon-arrow" src="/static/img/arrow_1.png"></image>
					</view>
				</view>

				<view class="form-item-border"></view>

				<view class="uni-flex  uni-row form-item">
					<view class="flex-item form-item-label">详细地址</view>
					<view class="flex-item">
						<input v-model="form.detail" class="uni-input form-item-input" placeholder-style="color:#999999" name="input"
						 placeholder="请输入" />
					</view>
				</view>
				<view class="form-item-border"></view>

				<view class="uni-flex  uni-row form-item-no-delivery-time">
					<textarea @blur="copyAddress=''" @focus="copyAddress=''" v-model="copyAddress" class="form-textarea"
					 placeholder-style="color:#999999" placeholder="可直接粘贴收/寄件人信息"></textarea>
				</view>
			</form>
		</view>
		<view class="content-bg">
			<button @tap="save" class="address-info-button" type="warn">保存</button>
		</view>

		<van-popup :close-on-click-overlay="true" position="bottom" :show="showArea" @close="onCancel">
			<!-- <van-picker ref="areaPicker" column-class="picker-column" toolbar-class="picker-toolbar" :show-toolbar="true"
			 :columns="columns" @cancel="onCancel" @confirm="onConfirm" @change="onChange" :item-height="40" /> -->

			<van-area :value="selectAreaCode" column-class="picker-column" toolbar-class="picker-toolbar" :area-list="areaList"
			 @cancel="onCancel" @confirm="onAreaConfirm" />
		</van-popup>


	</view>
</template>

<script>
	import AddressParse from '../../../utils/zh-address-parse.min.js';
	import area from '../../../utils/area.js';

	export default {

		data() {
			return {
				addressInfoTitle: '地址信息',
				type: '',
				copyAddress: '',
				areas: [],
				areaList: area,
				form: {
					area: "", // 区县
					city: "", // 市
					province: '', // 省
					detail: "", // 详情
					name: "", // 姓名
					phone: "", // 手机
					postalCode: "" // 邮编

				},
				selectAreaCode: '',
				selectProvinceNumber: '',
				selectCityNumber: '',
				selectAreaNumber: '',
				receivingForm: {},
				selectAreas: [],
				showArea: false,
				columns: [{
						values: '',
						className: 'column1',
						defaultIndex: 0
					},
					{
						values: '',
						className: 'column2',
						defaultIndex: 0
					},
					{
						values: '',
						className: 'column3',
						defaultIndex: 0
					}
				],
				areaName: ''

			};
		},
		watch: {
			copyAddress(val) {
				if (val) {
					let vm = this;
					const options = {
						type: 0, // 哪种方式解析，0：正则，1：树查找
						textFilter: [], // 预清洗的字段
						nameMaxLength: 4, // 查找最大的中文名字长度
					}
					const parseResult = AddressParse(val, options);
					vm.form = parseResult;
					// 获取省名称、选中省
					let provinceName = vm.form.province;
					let provinceCode = vm.getKey(vm.areaList.province_list, provinceName);
			
					let cityName = vm.form.city;
					let cityCode = vm.getKey2(vm.areaList.city_list, cityName, provinceCode);
					
					let countyName = vm.form.area;
					let countyCode = vm.getKey2(vm.areaList.county_list, countyName, cityCode);

					vm.selectAreaCode = countyCode;
					vm.form.selectAreaName = provinceName + ' ' + cityName + ' ' + countyName;

				}
			}
		},
		onLoad(options) {
			let vm = this;
			let type = options.type;
			vm.type = type;
			let receivingForm = vm.$store.getters.getReceivingForm;

			if (receivingForm) {
				vm.receivingForm = receivingForm;

				if (type === 'sender') {
					// 如果名称为空则代表第一次进入
					if (receivingForm.sender) {
						vm.form.detail = receivingForm.senderAddress;
						vm.form.name = receivingForm.sender;
						vm.form.phone = receivingForm.senderMobileNumber;
						vm.selectAreaCode = receivingForm.senderAreaNumber;
						vm.form.selectAreaName = receivingForm.senderAreaName;
					}
				} else if (type === 'addressee') {
					if (receivingForm.addressee) {
						vm.form.detail = receivingForm.addresseeAddress;
						vm.form.name = receivingForm.addressee;
						vm.form.phone = receivingForm.addresseeMobileNumber;
						vm.selectAreaCode = receivingForm.addresseeAreaNumber;
						vm.form.selectAreaName = receivingForm.addresseeAreaName;
					}
				}
			} else {
				uni.navigateBack();
			}
		},
		methods: {
			onCancel() {
				let vm = this;
				vm.showArea = false;
			},
			getKey(o, value) {
				function findKey(obj, value, compare = (a, b) => a === b) {
					return Object.keys(obj).find(k => compare(obj[k], value));
				}
				return findKey(o, value);
			},
			getKey2(o,value,pk) {
				pk = pk + '';
				pk = pk.substring(0,2);
				let s = JSON.stringify(o);
				let arr = s.split(",");
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].indexOf(value) != -1 && arr[i].indexOf(pk) == 1) {
						return arr[i].replaceAll("\"", "").replaceAll(":", "").replaceAll(value, "").replaceAll(",", "")
					}
				}
				return "";
			},
			onAreaCancel(event) {
				let vm = this;
				vm.showArea = false;
			},
			onAreaConfirm(event) {
				let vm = this;
				const {
					values,
					indexs
				} = event.detail;
				

				vm.selectAreaCode = values[2].code;
				vm.showArea = false;
				vm.form.selectAreaName = values[0].name + ' ' + values[1].name + ' ' + values[2].name;

			},
			save() {
				let vm = this;

				// 校验
				if (!vm.form.name) {
					uni.showModal({
						title: '温馨提示',
						confirmColor: '#DE1111',
						content: '姓名不能为空，请填写！',
						success: function(res) {}
					});
					return;
				}

				if (!vm.form.phone) {
					uni.showModal({
						title: '温馨提示',
						confirmColor: '#DE1111',
						content: '手机号码不能为空，请填写！',
						success: function(res) {}
					});
					return;
				}
				/*else {
					let reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
					if (!reg.test(vm.form.phone)) {
						uni.showModal({
							title: '温馨提示',
							confirmColor: '#DE1111',
							content: '手机号码错误，请输入正确手机号！',
							success: function(res) {}
						});
						return;
					}
				}*/


				if (!vm.selectAreaCode) {
					uni.showModal({
						title: '温馨提示',
						confirmColor: '#DE1111',
						content: '请选择地区！',
						success: function(res) {}
					});
					return;
				}

				if (!vm.form.detail) {
					uni.showModal({
						title: '温馨提示',
						confirmColor: '#DE1111',
						content: '请填写详细地址！',
						success: function(res) {}
					});
					return;
				}

				if (vm.type === 'sender') {
					vm.receivingForm.sender = vm.form.name;
					vm.receivingForm.senderMobileNumber = vm.form.phone;
					vm.receivingForm.senderAddress = vm.form.detail;
					vm.receivingForm.senderAreaNumber = vm.selectAreaCode;
					vm.receivingForm.senderAreaName = vm.form.selectAreaName;

				} else if (vm.type === 'addressee') {
					vm.receivingForm.addressee = vm.form.name
					vm.receivingForm.addresseeMobileNumber = vm.form.phone
					vm.receivingForm.addresseeAddress = vm.form.detail;
					vm.receivingForm.addresseeAreaNumber = vm.selectAreaCode;
					vm.receivingForm.addresseeAreaName = vm.form.selectAreaName;
				}

				vm.$store.dispatch("addReceivingForm", vm.receivingForm);

				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 前一个页面
				uni.navigateBack({
					success: function() {
						beforePage.onLoad(); // 执行前一个页面的onLoad方法
					}
				});

			},
			showSelectArea() {
				let vm = this;
				vm.showArea = true;
			},

		}
	}
</script>

<style lang="scss">
	.picker-toolbar {
		font-size: 32rpx;
		line-height: 84rpx;
		height: 84rpx;
		border-bottom: 1rpx solid #DDDDDD;

		.van-picker__cancel {
			color: #999999;
		}

		.van-picker__confirm {
			color: #DE1111;
		}
	}

	.address-info-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #282828;

		.popup-title-box {
			display: flex;
			height: 84rpx;
			width: 100%;
			font-size: 32rpx;

			.popup-title-right-button {
				height: 51rpx;
				line-height: 51rpx;
				margin: 16rpx 30rpx 16rpx 0;
				text-align: right;
				width: 50%;
			}

			.popup-title-left-button {
				height: 51rpx;
				line-height: 51rpx;
				width: 50%;
				margin: 16rpx 0 16rpx 30rpx;
			}
		}

		.popup-border {
			width: 100%;
			height: 1rpx;
			background-color: #DDDDDD;
		}

		.building-select-box {
			height: 518rpx;
			width: 100%;
		}

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

			.address-info-button {
				margin: 743rpx 24rpx 147rpx 24rpx;
				background-color: #DE1111;
				font-size: 36rpx;
				border-radius: 6px;
				width: 702rpx;
				height: 98rpx;
			}
		}

		.head-img {
			width: 750rpx;
			height: 460rpx;
		}


		.form-textarea {
			margin-top: 40rpx;
			margin-bottom: 60rpx;
			width: 558rpx;
			height: 205rpx;
			background-color: #F5F5F5;
			border-radius: 10rpx;
			border: 2px solid #EAEAEA;
			padding: 30rpx;
			text-align: left;

		}

		.form-box {
			display: flex;
			background-color: #FFFFFF;
			position: absolute;
			top: 320rpx;
			font-size: 32rpx;
			line-height: 40rpx;
			padding: 0 40rpx;
			color: #666666;

			.form-item {
				padding: 40rpx 0;
				display: flex;

				.form-item-label {
					width: 156rpx;
				}

				.form-item-input {
					text-align: right;
					height: 40rpx;
					width: 466rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.form-item-arrow {
					display: flex;
					width: 466rpx;
					position: relative;

					.form-item-arrow-text {
						width: 466rpx;
						text-align: right;

					}

					.form-icon-arrow {
						width: 21rpx;
						height: 34rpx;
						margin-left: 24rpx;
						position: relative;
						top: 4rpx;

					}
				}

			}

			.form-item-no-delivery-time {
				height: 300rpx;
			}

			.form-item-border {
				width: 100%;
				height: 2rpx;
				background-color: #EAEAEA;
			}

		}

		.address-info-title-box {
			position: absolute;
			top: 100rpx;
			left: 24rpx;
			text-align: left;
			color: #FFFFFF;

			.address-info-title {
				font-size: 46rpx;
				margin-bottom: 10rpx;
			}

			.address-info-subtitle {
				font-size: 36rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>
