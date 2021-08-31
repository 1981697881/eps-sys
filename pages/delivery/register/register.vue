<template>
	<view class="register-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_9.png"></image>
		<view class="register-title-box">
			<view class="register-title">
				新会员注册
			</view>
			<view class="register-subtitle">
				Registering
			</view>
		</view>

		<view class="form-box">
			<form>
				<view class="uni-flex  uni-row form-item">
					<view class="flex-item form-item-label">姓名</view>
					<view class="flex-item">
						<input v-model="form.realName" class="uni-input form-item-input" placeholder-style="color:#999999" name="input"
						 placeholder="请输入" />
					</view>
				</view>
				<view class="form-item-border"></view>

				<view class="uni-flex  uni-row form-item">
					<view class="flex-item form-item-label">手机号</view>
					<view class="flex-item">
						<button class="get-phone-number-btn" v-if="!(form.mobileNumber)" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定微信手机号</button>
						<input type="number" v-else v-model="form.mobileNumber" class="uni-input form-item-input" placeholder-style="color:#999999"
						 name="input" placeholder="请输入" />
					</view>
				</view>
				<view class="form-item-border"></view>

				<view @click="showSelectBuilding" class="uni-flex  uni-row form-item">
					<view class="flex-item form-item-label" style="width: 100rpx;">楼栋号</view>
					<view class="flex-item uni-row form-item-arrow" style="width: 522rpx;">
						<text v-if="selectBuildingNameIsNull" style="width: 477rpx;" class="form-item-arrow-text color999">请选择</text>
						<text v-else class="form-item-arrow-text color28" style="width: 477rpx;">{{selectBuildingName}}</text>
						<image class="form-icon-arrow" src="/static/img/arrow_1.png"></image>
					</view>
				</view>

				<view class="form-item-border"></view>
				<view class="uni-flex  uni-row form-item">
					<view class="flex-item form-item-label">具体房号（户号）</view>
					<view class="flex-item"><input v-model="form.houseNumber" class="uni-input form-item-input" placeholder-style="color:#999999"
						 name="input" placeholder="如: A2" /></view>
				</view>
				<!-- <view class="form-item-border"></view> -->
				
		<!-- 		<view class="uni-flex  uni-row form-item">
					<view class="flex-item form-item-label">消息订阅</view>
					<view class="flex-item">
						<button v-if="form.wxMaMsgSubscribe" class="get-phone-number-btn colorG" @tap="requestMsg">已订阅</button>
						<button v-else class="get-phone-number-btn" @tap="requestMsg">点击订阅快递消息</button>
					</view>
				</view> -->

				<view class="form-item-border"></view>
				<view @click="showSelectDeliveryMethod" class="uni-flex  uni-row form-item">
					<view class="flex-item form-item-label">派送方式</view>
					<view class="flex-item uni-row form-item-arrow">
						<text v-if="selectDeliveryMethodNameIsNull" class="form-item-arrow-text color999">请选择</text>
						<text v-else class="form-item-arrow-text color28">{{selectDeliveryMethodName}}</text>
						<image class="form-icon-arrow" src="/static/img/arrow_1.png"></image>
					</view>
				</view>

				<view class="form-item-border"></view>
				<view v-if="showDeliveryTime" class="uni-flex  uni-row form-item" @tap="goToNoDeliveryTime">
					<view class="flex-item form-item-label">不适合配送时间段</view>
					<view class="flex-item uni-row form-item-arrow">
						<text class="form-item-arrow-text color999">{{showTimesBottom?'请选择':''}}</text>
						<image class="form-icon-arrow" src="/static/img/arrow_1.png"></image>
					</view>
				</view>
				<view v-if="showDeliveryTime" class="form-item-border"></view>
				<view class="uni-flex  uni-row form-item-no-delivery-time">
					<view class="uni-flex">
						<view class="times-box" v-if="showWeekdays &&　showDeliveryTime">
							<view class="times-label">工作日</view>
							<view class="time-item-box">
								<view class="time-item" v-bind:key="index" v-for="(item,index) in noDeliveryTime.weekdays">
									{{item.times}}
								</view>
							</view>
						</view>
						<view class="times-box" v-if="showHoliday &&　showDeliveryTime">
							<view class="times-label">节假日</view>
							<view class="time-item-box">
								<view class="time-item" v-bind:key="index" v-for="(item,index) in noDeliveryTime.holiday">
									{{item.times}}
								</view>
							</view>
						</view>
					</view>
					<view style="height: 40rpx; width: 100%;" v-if="showTimesBottom"></view>
				</view>
			</form>
		</view>
		<view class="content-bg">
			<button :style="{marginTop: buttonTopMargin,marginBottom: '147rpx',marginLeft: '24rpx',marginRight: '24rpx'}" class="register-button"
			 type="warn" @click="formSubmit">注册</button>
		</view>
		<van-popup :close-on-click-overlay="true" position="bottom" :show="showBuilding" @close="closeBuilding">
			<van-picker column-class="picker-column" toolbar-class="picker-toolbar" :show-toolbar="true" :columns="columns"
			 @cancel="onCancel" @confirm="onConfirm" @change="onChange" :item-height="40" />
		</van-popup>
		<van-popup :close-on-click-overlay="true" position="bottom" :show="showDeliveryMethod" @close="closeDeliveryMethod">
			<van-picker column-class="picker-column" toolbar-class="picker-toolbar" :show-toolbar="true" :columns="deliveryMethodColumns"
			 @cancel="onCancelDeliveryMethod" @confirm="onConfirmDeliveryMethod" :item-height="40" />
		</van-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				isRegisterOk: false,
				showMsgBox: false,
				msgDesc: '',
				showDeliveryTime: false,
				deliveryMethodColumns: [{
					values: [{
						code: "SELF",
						text: "到店自提"
					}, {
						code: "DELIVERY",
						text: "上门派送"
					}],
					className: 'delivery-method-columns',
					defaultIndex: 0
				}],
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
				selectDeliveryMethodName: '',
				selectDeliveryMethodValue: '',
				selectDeliveryMethodNameIsNull: true,
				deliveryMethod: [{
						value: "DELIVERY",
						name: "上门派送"
					},
					{
						value: "SELF",
						name: "到店自提"
					}
				],
				buttonTopMargin: '0rpx',
				buttonBottomMargin: '0rpx',
				buildingL3: [],
				buildings: [],
				showBuilding: false,
				showDeliveryMethod: false,
				buildingPickerShow: false,
				selectBuildings: [],
				selectBuildingName: '',
				selectBuildingNameIsNull: true,
				form: {
					realName: '',
					mobileNumber: '',
					buildingCode: '',
					houseNumber: '',
					wxMaMsgSubscribe: false
				},
				showTimesBottom: true,
				showWeekdays: false,
				showHoliday: false,
				noDeliveryTime: null,
				showConfirmRegister: false
			};
		},
		created() {
			let vm = this;
		},
		onLoad(option) {
			console.log('register onLoad');
			let vm = this;
			let noDeliveryTime = vm.$store.getters.getNoDeliveryTime;
			vm.showNoDeliveryTime(noDeliveryTime);
			// 获取值
			let form = vm.$store.getters.getRegisterForm
			if (form) {
				vm.form = vm.$store.getters.getRegisterForm;
				vm.selectBuildings = vm.form.selectBuildings;
				vm.selectDeliveryMethodValue = vm.form.selectDeliveryMethodValue;
				vm.deliveryMethodColumns = vm.form.deliveryMethodColumns;
				vm.columns = vm.form.columns;
				vm.loadBuildingName();
			} else {
				vm.loadBuilding();
			}
			vm.setMargin();
		},
		methods: {
			requestMsg() {
				let vm = this;
				wx.requestSubscribeMessage({
					tmplIds: [vm.$msgTempId],
					success: (res) => {
						if (res[vm.$msgTempId] === 'accept') {
							uni.showToast({
								title: '订阅成功！',
								duration: 1000,
								success(data) {
									vm.form.wxMaMsgSubscribe = true;
								}
							})
						} else {
							vm.form.wxMaMsgSubscribe = false;
						}
					},
					fail(err) {
						vm.form.wxMaMsgSubscribe = false;
					}
				})
			},
			getPhoneNumber(e) {
				let vm = this;
				uni.showLoading({
					title: '获取中...'
				});
				let {
					iv,
					encryptedData
				} = e.detail;
				let userInfo = vm.$store.getters.getUserInfo;
	
				if (userInfo && iv && encryptedData) {

					let obj = {
						iv: iv,
						encryptedData: encryptedData,
						sessionKey: userInfo.sessionKey
					}

					uni.request({
						url: vm.$api.wxMaAuth.phone,
						data: obj,
						header: {},
						success: (res) => {
							uni.hideLoading();
							if (res.data.status === 200) {
								let phoneNoInfo = res.data.data.phoneNoInfo;
								vm.form.mobileNumber = phoneNoInfo.phoneNumber;
								vm.$store.dispatch("addPhoneNoInfo", phoneNoInfo);

							} else {
								uni.showModal({
								    title: '温馨提示',
									confirmColor: '#DE1111',
								    content: '获取手机号失败！',
								    success: function (res) {}
								});
			
							}

						}
					})


				} else {
					uni.hideLoading();
					uni.showModal({
					    title: '温馨提示',
						confirmColor: '#DE1111',
					    content: '获取授权失败，请重试！',
					    success: function (res) {}
					});
					return;
				}
			},
			showNoDeliveryTime(noDeliveryTime) {
				let vm = this;
				vm.showWeekdays = false
				vm.showHoliday = false
				vm.showTimesBottom = true;
				if (noDeliveryTime) {
					if ((noDeliveryTime.weekdays && noDeliveryTime.weekdays.length && noDeliveryTime.weekdays.length > 0) ||
						(noDeliveryTime.holiday && noDeliveryTime.holiday.length && noDeliveryTime.holiday.length > 0)) {
						vm.showTimesBottom = false;
						vm.noDeliveryTime = noDeliveryTime;
						if (noDeliveryTime.weekdays && noDeliveryTime.weekdays.length && noDeliveryTime.weekdays.length > 0) {
							vm.showWeekdays = true
						}
						if (noDeliveryTime.holiday && noDeliveryTime.holiday.length && noDeliveryTime.holiday.length > 0) {
							vm.showHoliday = true
						}
					}
				}
				vm.setMargin();
			},
			registerOk() {
				let vm = this;
				wx.requestSubscribeMessage({
					tmplIds: [vm.$msgTempId],
					success: (res) => {
						if (res[vm.$msgTempId] === 'accept') {
							uni.showToast({
								title: '订阅成功！',
								duration: 1000,
								success(data) {
									vm.form.wxMaMsgSubscribe = true;
								}
							})
						} else {
							vm.form.wxMaMsgSubscribe = false;
						}
					},
					fail(err) {
						vm.form.wxMaMsgSubscribe = false;
					}
				});
				// 注册完返回首页
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 前一个页面
				uni.navigateBack({
					success: function() {
						beforePage.onLoad(); // 执行前一个页面的onLoad方法
					}
				});
			},
			formatTree(buildings, arr, vm) {
				if (buildings && buildings.length && buildings.length > 0) {
					for (var i = 0; i < buildings.length; i++) {
						let children = []
						vm.formatTree(buildings[i].children, children, vm)
						arr.push({
							text: buildings[i].name,
							code: buildings[i].code,
							children: children
						});
					}
				}
			},
			loadBuilding() {
				let vm = this;
				uni.request({
					url: vm.$api.building.tree,
					data: {},
					header: {},
					success: (res) => {

						if (res.data.data && res.data.data.buildings) {
							// 格式化并保存一份
							let arr = [];
							vm.formatTree(res.data.data.buildings, arr, vm);
							vm.buildings = arr;
							vm.columns = [{
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
							]
							// 赋值第一列
							vm.columns[0].values = vm.buildings;
							if (vm.selectBuildings && vm.selectBuildings[0]) {
								// 如果有选中则选中
								for (var i = 0; i < vm.buildings.length; i++) {
									if (vm.buildings[i].code === vm.selectBuildings[0].code) {
										// 选中
										vm.columns[0].defaultIndex = i;
									}
								}
							} else {
								// 如果没有默认值，则选中第一个
								vm.columns[0].defaultIndex = 0;
								vm.selectBuildings[0] = vm.columns[0].values[0]
							}

							// 获取第一列的默认值
							let oneDefault = vm.columns[0].values[vm.columns[0].defaultIndex];
							if (oneDefault && oneDefault.children && oneDefault.children.length) {
								// 第一列的children赋值给第二列
								vm.columns[1].values = oneDefault.children;
								// 赋值第二列
								if (vm.selectBuildings && vm.selectBuildings[1]) {
									for (var i = 0; i < oneDefault.children.length; i++) {
										if (oneDefault.children[i].code === vm.selectBuildings[1].code) {
											// 选中
											vm.columns[1].defaultIndex = i;
										}
									}
								} else {
									// 如果没有默认值，则选中第一个
									vm.columns[1].defaultIndex = 0;
									vm.selectBuildings[1] = vm.columns[1].values[0]
								}

								// 获取第二列的默认值
								let twoDefault = vm.columns[1].values[vm.columns[1].defaultIndex];

								if (twoDefault && twoDefault.children && twoDefault.children.length) {
									// 第二列的children赋值给第三列
									vm.columns[2].values = twoDefault.children

									// 赋值第三列
									if (vm.selectBuildings && vm.selectBuildings[2]) {
										for (var i = 0; i < twoDefault.children.length; i++) {
											if (twoDefault.children[i].code === vm.selectBuildings[2].code) {
												// 选中
												vm.columns[2].defaultIndex = i;
											}
										}
									} else {
										// 如果没有默认值，则选中第一个
										vm.columns[2].defaultIndex = 0;
										vm.selectBuildings[2] = vm.columns[2].values[0]
									}
								}

							}
						}
						vm.loadBuildingName();
						// 等待dom渲染完毕之后，在去显示 三级联动。
						this.$nextTick(function() {
							this.buildingPickerShow = true;
						})
					}
				})

			},
			goToNoDeliveryTime() {
				let vm = this;
				let obj = {
					realName: vm.form.realName,
					mobileNumber: vm.form.mobileNumber,
					houseNumber: vm.form.houseNumber,
					selectBuildings: vm.selectBuildings,
					wxMaMsgSubscribe: vm.form.wxMaMsgSubscribe,
					deliveryMethodColumns: vm.deliveryMethodColumns,
					selectDeliveryMethodValue: vm.selectDeliveryMethodValue,
					columns: vm.columns
				}
				// 储存
				vm.$store.dispatch('addRegisterForm', obj);
				uni.navigateTo({
					url: "/pages/delivery/no-delivery-time/no-delivery-time?pageFlag=register"
				})
			},
			showSelectBuilding() {
				let vm = this;
				vm.loadBuilding();
				vm.showBuilding = true;
			},
			showSelectDeliveryMethod() {
				let vm = this;
				vm.showDeliveryMethod = true;
			},
			closeDeliveryMethod() {
				let vm = this;
				vm.showDeliveryMethod = false;
			},
			closeBuilding() {
				let vm = this;
				vm.showBuilding = false;
			},
			formSubmit() {
				let vm = this;
				// 校验
				if (!vm.form.realName) {
					vm.msgDesc = "";
					uni.showModal({
					    title: '温馨提示',
						confirmColor: '#DE1111',
					    content: '姓名不能为空，请填写！',
					    success: function (res) {}
					});
					return;
				}
				if (!vm.form.mobileNumber) {
					uni.showModal({
					    title: '温馨提示',
						confirmColor: '#DE1111',
					    content: '手机号码不能为空，请填写！',
					    success: function (res) {}
					});
					return;
				} else {
					let reg = /(^1\d+$)/;
					if (!reg.test(vm.form.mobileNumber) || !(vm.form.mobileNumber.length === 11)) {
						uni.showModal({
						    title: '温馨提示',
							confirmColor: '#DE1111',
						    content: '手机号码错误，请输入正确手机号！',
						    success: function (res) {}
						});
						return;
					}
				}

				if (vm.selectBuildings.length < 1) {
					uni.showModal({
					    title: '温馨提示',
						confirmColor: '#DE1111',
					    content: '楼栋号不能为空，请选择！',
					    success: function (res) {}
					});
					return;
				}

				if (!vm.form.houseNumber) {
					uni.showModal({
					    title: '温馨提示',
						confirmColor: '#DE1111',
					    content: '户号不能为空，请填写！',
					    success: function (res) {}
					});
					return;
				}
				if (!vm.selectDeliveryMethodValue) {
					uni.showModal({
					    title: '温馨提示',
						confirmColor: '#DE1111',
					    content: '派送方式不能为空，请选择！',
					    success: function (res) {}
					});
					return;
				}
				
				uni.showModal({
				    title: '温馨提示',
					confirmColor: '#DE1111',
					confirmText: '确认注册',
				    content: '注册后手机号将无法修改，如需修改请联系客服进行修改！',
				    success: function (res) {
				        if (res.confirm) {
							// 确认注册
							vm.requestRegister();
				        } else if (res.cancel) {
							console.log("放弃注册")
				        }
				    }
				});
			},
			requestRegister() {
				let vm = this;
				vm.showConfirmRegister = false;
				uni.showLoading({
					title: '注册中...'
				});
				let noDeliveryTime = vm.$store.getters.getNoDeliveryTime;
				let weekdaysNoDeliveryTimeCodes = '';
				if (noDeliveryTime) {
					for (var i = 0; i < noDeliveryTime.weekdays.length; i++) {
						weekdaysNoDeliveryTimeCodes += noDeliveryTime.weekdays[i].code;
						if (i < noDeliveryTime.weekdays.length - 1) {
							weekdaysNoDeliveryTimeCodes += ","
						}
					}
				}
				let holidayNoDeliveryTimeCodes = '';
				if (noDeliveryTime) {
					for (var i = 0; i < noDeliveryTime.holiday.length; i++) {
						holidayNoDeliveryTimeCodes += noDeliveryTime.holiday[i].code;
						if (i < noDeliveryTime.holiday.length - 1) {
							holidayNoDeliveryTimeCodes += ","
						}
					}
				}
				let userInfo = vm.$store.getters.getUserInfo;
				let nickname = vm.$store.getters.getNickname;
				let buildingCode = ''
				for (var i = 0; i < vm.selectBuildings.length; i++) {
					if (vm.selectBuildings[i] && vm.selectBuildings[i].code) {
						buildingCode = vm.selectBuildings[i].code
					}
				}
				let obj = {
					openId: userInfo.openid,
					unionId: userInfo.unionid,
					nickname: nickname,
					realName: vm.form.realName,
					houseNumber: vm.form.houseNumber,
					mobileNumber: vm.form.mobileNumber,
					deliveryMethod: vm.selectDeliveryMethodValue,
					// wxMaMsgSubscribe: vm.form.wxMaMsgSubscribe,
					buildingCode: buildingCode,
					weekdaysNoDeliveryTimeCodes: weekdaysNoDeliveryTimeCodes,
					holidayNoDeliveryTimeCodes: holidayNoDeliveryTimeCodes
				}
				uni.request({
					url: vm.$api.member.register,
					data: obj,
					header: {},
					success: (res) => {
						uni.hideLoading();
						if (res.data.status === 200) {
							uni.showModal({
							    title: '温馨提示',
								confirmColor: '#DE1111',
							    content: '注册成功！',
							    success: function (res) {
							        // 注册成功后返回index
									vm.registerOk();
							    }
							});
							
						} else {
							uni.showModal({
							    title: '温馨提示',
								confirmColor: '#DE1111',
							    content: res.data.desc,
							    success: function (res) {
									
								}
							});
						}
					}
				})

			},
			onConfirm(event) {
				let vm = this;
				const {
					picker,
					value,
					index
				} = event.detail;
				vm.selectBuildings = value;
				vm.loadBuildingName();
				vm.showBuilding = false;
			},
			onCancel() {
				let vm = this;
				vm.showBuilding = false;
			},
			onConfirmDeliveryMethod(event) {
				let vm = this;
				const {
					picker,
					value,
					index
				} = event.detail;
				vm.selectDeliveryMethod = value;
				let name = value[0].text;
				let code = value[0].code;
				vm.selectDeliveryMethodValue = code;
				vm.selectDeliveryMethodName = name;
				vm.showDeliveryTime = code === 'DELIVERY';
				vm.showDeliveryMethod = false;
				vm.selectDeliveryMethodNameIsNull = false;
				if (code === 'SELF') {
					vm.showTimesBottom = true;
				}
				vm.setMargin();
			},
			onCancelDeliveryMethod() {
				let vm = this;
				vm.showDeliveryMethod = false;
			},
			onChange(event) {
				let vm = this;
				const {
					picker,
					value,
					index
				} = event.detail;
				switch (index) {
					case 0:
						// 改变第一级，则改变其他两级
						if (value[0] && value[0].children && value[0].children.length) {
							vm.columns[1].values = value[0].children
							// 默认选中第一个
							vm.columns[1].defaultIndex = 0;
							if (vm.columns[1].values[0] && vm.columns[1].values[0].children && vm.columns[1].values[0].children.length) {
								vm.columns[2].values = vm.columns[1].values[0].children
								vm.columns[2].defaultIndex = 0;
							} else {
								vm.columns[2].values = []
							}
						} else {
							vm.columns[1].values = []
							vm.columns[2].values = []
						}

						break;
					case 1:
						// 改变第二级
						if (value[1] && value[1].children && value[1].children.length) {
							vm.columns[2].values = value[1].children
							vm.columns[2].defaultIndex = 0;
						} else {
							vm.columns[2].values = []
						}
						break;
					case 2:
						// 改变第三级
						break;
				}
			},
			loadBuildingName() {
				let vm = this;
				let name = '';
				for (var i = 0; i < vm.selectBuildings.length; i++) {
					if (vm.selectBuildings[i] && vm.selectBuildings[i].text) {
						name += (vm.selectBuildings[i].text + ' ')
					}
				}
				vm.selectBuildingName = name;
				vm.selectBuildingNameIsNull = false;
				// vm.setMargin();
			},
			loadDeliveryMethodName() {
				let vm = this;
				let name = vm.deliveryMethodColumns[0].values[vm.deliveryMethodColumns[0].defaultIndex].text;
				vm.selectDeliveryMethodName = name;
				vm.selectDeliveryMethodNameIsNull = false;
				// vm.setMargin();
			},
			setMargin() {
				let vm = this;
				let top = 786;
				let count = 0;
				
				if (vm.showDeliveryTime) {
					top = 893
				}
				
				if (vm.showDeliveryTime && vm.noDeliveryTime) {
					count += 125
					top += 100;
					if (vm.noDeliveryTime.weekdays && vm.noDeliveryTime.weekdays.length && vm.noDeliveryTime.weekdays.length > 0) {

						// 加标题高度与底部高度
						count += 140;
						// 获取行数
						let row = vm.noDeliveryTime.weekdays.length / 3;
						// 获取行数总高
						row *= 82;
						// 获取总高
						count += row;
					}
					if (vm.noDeliveryTime.holiday && vm.noDeliveryTime.holiday.length && vm.noDeliveryTime.holiday.length > 0) {
						// 加标题高度与底部高度
						count += 140;
						// 获取行数
						let row = vm.noDeliveryTime.holiday.length / 3;
						// 获取行数总高
						row *= 82;
						// 获取总高
						count += row;
					}

				}

				if (count > 250) {
					top += (count - 250);
				}
	
				vm.buttonTopMargin = top + 'rpx'

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
	
	.colorG {
		color: #07c160;
	}

	button::after {
		border: none;
	}

	button {
		font-size: 32rpx;
		line-height: 40rpx;
		height: 40rpx;
		color: #DE1111;
		background-color: #FFFFFF;
		width: 366rpx;
		text-align: right;
		padding: 0;
	}

	.get-phone-number-btn {
		width: 366rpx;
	}

	.picker-column {
		font-size: 34rpx;
		line-height: 84rpx;
		height: 84rpx;
		color: #000000;
	}

	.register-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #282828;

		.msg-box {
			text-align: center;
			/* width: 622rpx; */
			border-radius: 10rpx;

			.msg-desc {
				font-size: 32rpx;
				color: #999999;
				line-height: 40rpx;
				margin: 40rpx;
			}

			.msg-btn {
				font-size: 36rpx;
				color: #DE1111;
				border-top: 1rpx solid #999999;
				padding-top: 20rpx;
				margin-bottom: 40rpx;
				line-height: 40rpx;
			}
		}

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

			.register-button {
				background-color: #DE1111;
				font-size: 36rpx;
				border-radius: 6px;
				width: 702rpx;
				height: 98rpx;
				line-height: 98rpx;
				text-align: center;
			}
		}

		.head-img {
			width: 750rpx;
			height: 460rpx;
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
					width: 256rpx;
				}

				.form-item-input {
					text-align: right;
					height: 40rpx;
				}

				.form-item-arrow {
					display: flex;
					width: 366rpx;
					position: relative;

					.form-item-arrow-text {
						width: 321rpx;
						text-align: right;
					}

					.form-icon-arrow {
						width: 21rpx;
						height: 34rpx;
						margin-left: 24rpx;
						position: relative;
						top: 2rpx;

					}
				}

			}

			.form-item-no-delivery-time {
				/* width: 622rpx; */

				.times-box {
					margin-top: 40rpx;
					margin-bottom: 40rpx;

					.times-label {
						height: 40rpx;
						line-height: 40rpx;
						margin-bottom: 30rpx;
					}

					.time-item-box {
						display: flex;
						flex-wrap: wrap;

						.time-item {
							border-radius: 8rpx;
							width: 200rpx;
							height: 72rpx;
							font-size: 28rpx;
							text-align: center;
							line-height: 72rpx;
							background-color: #FFE7E7;
							color: #DE1111;
							margin: 0 5rpx 10rpx 5rpx;
						}

						.time-item:nth-child(3n+1) {}
					}

				}
			}

			.form-item-border {
				width: 100%;
				height: 2rpx;
				background-color: #EAEAEA;
			}

		}

		.register-title-box {
			position: absolute;
			top: 100rpx;
			left: 24rpx;
			text-align: left;
			color: #FFFFFF;

			.register-title {
				font-size: 46rpx;
				margin-bottom: 10rpx;
			}

			.register-subtitle {
				font-size: 36rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>
