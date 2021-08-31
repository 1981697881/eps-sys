import {
	cancelOrder,
	takeOrder,
	delOrder,
	payOrder
} from "@/api/order";
import dialog from "@/utils/dialog";
import {
	weappPay
} from "@/libs/wechat";

import {
	_router
} from '@/utils'

export function cancelOrderHandle(orderId) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '提示',
			content: '确认取消该订单?',
			success(res) {
				if (res.confirm) {
					cancelOrder(orderId)
						.then(res => {
							uni.showToast({
								title: '取消成功',
								icon: 'success',
								duration: 2000
							});
							resolve(res);
						})
						.catch(err => {
							uni.showToast({
								title: '取消失败',
								icon: 'none',
								duration: 2000
							});
							reject(err);
						});
				} else if (res.cancel) {}
			}
		})
	});
}

export function takeOrderHandle(orderId) {
	return new Promise((resolve, reject) => {
		takeOrder(orderId)
			.then(res => {
				uni.showToast({
					title: '收货成功',
					icon: 'success',
					duration: 2000
				});
				resolve(res);
			})
			.catch(err => {
				uni.showToast({
					title: '收货失败',
					icon: 'none',
					duration: 2000
				});
				reject(err);
			});
	});
}

export function delOrderHandle(orderId) {
	return new Promise((resolve, reject) => {
		dialog.confirm({
			mes: "确认删除该订单?",
			opts() {
				delOrder(orderId)
					.then(res => {
						uni.showToast({
							title: '删除成功',
							icon: 'success',
							duration: 2000
						});
						resolve(res);
					})
					.catch(err => {
						uni.showToast({
							title: '删除失败',
							icon: 'none',
							duration: 2000
						});
						reject(err);
					});
			}
		});
	});
}

// 使用订单号进行支付
export async function payOrderHandle(orderId, type, from, isPreSale) {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: "支付中",
			mask: true
		});
		payOrder(orderId, type, from)
			.then(async res => {
				await handleOrderPayResults(res.data, type, '', isPreSale)
				resolve()
			})
			.catch(err => {
				reject()
				uni.hideLoading()
				uni.showToast({
					title: err.msg || err.response.data.msg || err.response.data.message ||
						'订单支付失败',
					icon: "none",
					duration: 2000,
				});
			});
	});
}

// 处理调用支付接口的逻辑
// @type create(创建订单)||pay(支付订单)
export function handleOrderPayResults(data, type, payType, isPreSale) {
	return new Promise((resolve, reject) => {
		uni.hideLoading()
		switch (data.status) {
			// 订单号已存在
			case "ORDER_EXIST":
				resolve()
				break;
				// 取消支付
			case "EXTEND_ORDER":
				uni.showToast({
					title: data.msg,
					icon: "none",
					duration: 2000,
				});
				resolve()
				goOrderDetails(data.result, type, isPreSale)
				break;
			case "PAY_DEFICIENCY":
				break;
				// 支付出错
			case "PAY_ERROR":
				uni.showToast({
					title: data.msg,
					icon: "none",
					duration: 2000,
				});
				reject()
				goOrderDetails(data.result, type, isPreSale)
				break;
				// 未传递支付环境
			case "SUCCESS":
				uni.showToast({
					title: data.msg || data.payMsg,
					icon: "none",
					duration: 2000,
				});
				resolve()
				goOrderDetails(data.result, type, isPreSale)
				break;
				// H5支付
			case "WECHAT_H5_PAY":
				goOrderDetails(data.result, type, isPreSale)
				setTimeout(() => {
					resolve()
					// #ifdef H5
					// "https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=wx15171343713577e9f3a418b0865ef90000&package=2547890641"
					// location.href = data.result.jsConfig.mweb_url;
					// #endif
				}, 100);
				break;
				// 小程序支付
			case "WECHAT_PAY":
				weappPay(data.result.jsConfig).then(res => {
					resolve()
					// #ifdef MP-WEIXIN
					uni.getSetting({
					  withSubscriptions: true,
					  success(res) {
					    var itemSettings = res.subscriptionsSetting.itemSettings;
					    if (itemSettings) {
					      if (itemSettings['G0TXSlQpzkEgnfjlwKap5iUmDpN5vF0eYAoE8E9m3FQ']=='accept') {
					        goOrderDetails(data.result, type, isPreSale)
					      }else{
							  uni.showModal({
							  	title: '温馨提示',
							  	content: '为更好的促进您与买家的交流，成交时向您发送消息',
							  	confirmText: "同意",
							  	cancelText: "拒绝",
							  	success: function(res) {
							  		if (res.confirm) {
							  			Subscribe(['G0TXSlQpzkEgnfjlwKap5iUmDpN5vF0eYAoE8E9m3FQ','yKNOPC0o_5Nq_G21CMgk6PSo9mxL-EkfqgoxLIsubBk','o8ZksnkELUt6wLuqKouZi8UiVCmPTv69fUten0qg6po']).finally(mess=>{
							  				console.log(mess)
							  				goOrderDetails(data.result, type, isPreSale)
							  			})
							  		} else if (res.cancel) {
							  			///显示第二个弹说明一下
							  			uni.showModal({
							  				title: '温馨提示',
							  				content: '拒绝后您将无法获取实时的与卖家（买家）的交易消息',
							  				confirmText: "知道了",
							  				showCancel: false,
							  				success: function(res) {
							  					///点击知道了的后续操作 
							  					///如跳转首页面 
							  				}
							  			});
							  		}
							  	}
							  });
						  }
					    }
					  }
					})
					/* Subscribe(['G0TXSlQpzkEgnfjlwKap5iUmDpN5vF0eYAoE8E9m3FQ','yKNOPC0o_5Nq_G21CMgk6PSo9mxL-EkfqgoxLIsubBk','o8ZksnkELUt6wLuqKouZi8UiVCmPTv69fUten0qg6po']).finally(mess=>{
						console.log(mess)
						goOrderDetails(data.result, type, isPreSale)
					}) */
					/* uni.showModal({
						title: '温馨提示',
						content: '为更好的促进您与买家的交流，成交时向您发送消息',
						confirmText: "同意",
						cancelText: "拒绝",
						success: function(res) {
							if (res.confirm) {
								//调用订阅消息
								console.log('用户点击确定');
								//调用订阅
								subscribeMessage()
							} else if (res.cancel) {
								console.log('用户点击取消');
								///显示第二个弹说明一下
								uni.showModal({
									title: '温馨提示',
									content: '拒绝后您将无法获取实时的与卖家（买家）的交易消息',
									confirmText: "知道了",
									showCancel: false,
									success: function(res) {
										///点击知道了的后续操作 
										///如跳转首页面 
									}
								});
							}
						}
					}); */
					// #endif
				}).catch(res => {
					resolve()
					goOrderDetails(data.result, type, false)
				})
				break;
				// APP支付
			case "WECHAT_APP_PAY":
				weappPay(data.result.jsConfig).finally(() => {
					resolve()
					goOrderDetails(data.result, type, isPreSale)
				})
				break;
		}
	})
}
export const Subscribe = (tmplIds = []) => {
    return new Promise((resolve, reject) => {
        // 判断是否为微信小程序，不是的不做订阅进行跳过
        let isWx = false;
        // #ifdef MP-WEIXIN
        isWx = true;
        // #endif
        if (!isWx) resolve(1);
        // 判断基本库是否在2.8.3，低于的暂时不做订阅进行跳过
        const versionCan = compareVersion("2.8.3");
        if (versionCan === -1) resolve(1);
        // 主流程
        subscribeMessage(tmplIds, resolve, reject)
    })

}
export function subscribeMessage(tmplIds, resolve, reject) {
	 //判断是否已经订阅
	   
	uni.requestSubscribeMessage({
	        tmplIds,
	        success: async res => {
	            // 检查订阅数量
	            let checkSubscribeBool = await checkSubscribeAll(tmplIds, res);
	            if (checkSubscribeBool) {
	                // 用户完成订阅
	                console.log("[用户完成订阅]")
	                resolve(1);
	            } else {
	                // 跳去检查永久关闭订阅还是普通关闭订阅
	                guidSubscribeMessageAuthAfter(tmplIds, resolve, reject);
	            }
	        },
	        fail: res => {
	            console.log(res, "订阅，失败");
	            if (res.errCode == 20004) {
	                // console.log(res, 'fail:用户关闭了主开关，无法进行订阅,引导开启---');
	                guideOpenSubscribeMessage(tmplIds, resolve, reject);
	            }else{
					 reject(3)
				}
	        }
	    })

	// 调用订阅
	/* uni.requestSubscribeMessage({
		
		success(res) {
			console.log(res)
		},
		fail(error) {
			console.log(error)
		}
	}) */
}
// 计算用户订阅消息的数量
export function checkSubscribeAll(tmplIds, res) {
	// 将accept的生成一个数组，判断申请的订阅消息是不是已经订阅消息的子集
	let arr = [];
	for (const key of Object.keys(res)) {
		if (res[key] === 'accept') {
			arr.push(key);
		}
	}
	if (arr.length == tmplIds.length) {
		console.log('订阅完毕')
		return true
	} else {
		console.log('没订阅或者少订阅')
		return false
	}

}

// 检查用户是否授权完毕（检查时永久关闭还是普通关闭）
export function guidSubscribeMessageAuthAfter(tmplIds, resolve, reject) {
	uni.getSetting({
		withSubscriptions: true,
		success: async res => {
			let {
				authSetting = {},
					subscriptionsSetting: {
						mainSwitch = false,
						itemSettings = {}
					} = {}
			} = res;
			if (Object.keys(itemSettings).length == 0) { // 这种情况是普通关闭
				uni.showModal({
					title: "温馨提示",
					content: "同意订阅才能及时获知完成进度领取优惠",
					confirmText: "重新订阅",
					cancelText: "我再看看",
					success: res => {
						if (res.confirm) {
							// 重新调起授权订阅
							subscribeMessage(tmplIds, resolve, reject);
						} else if (res.cancel) {
							//没成功订阅，返回reject
							reject(2);
						}
					}
				});
			} else { // 这种是订阅成功或永久关闭
				let checkSubscribeBool = await checkSubscribeAll(tmplIds, itemSettings);
				if (
					authSetting["scope.subscribeMessage"] ||
					(mainSwitch && checkSubscribeBool)
				) {
					//成功
					console.log("用户手动开启同意了，订阅消息");
					resolve(1);
				} else {
					//失败，永久关闭
					guideOpenSubscribeMessage(tmplIds, resolve, reject);
				}
			}
		}
	});
}



//引导用户重新授权（永久关闭的方法）
export function guideOpenSubscribeMessage(tmplIds, resolve, reject) {
	// console.log(resolve, reject, 'rescovavasr1')
	uni.showModal({
		title: "温馨提示",
		content: "检测到您没有开启全部订阅消息的权限，是否去设置？",
		success: res => {
			if (res.confirm) {
				uni.openSetting({
					success: res => {
						// 在检查是否全部订阅完毕
						guidSubscribeMessageAuthAfter(tmplIds, resolve, reject);
					}
				});
			} else if (res.cancel) {
				// console.log(resolve, reject, 'rescovavasr2')
				uni.showModal({
					title: "温馨提示",
					content: "同意订阅才能及时获知完成进度领取优惠",
					showCancel: false,
					confirmText: "我知道了"
				});
				reject(2);
			}
		}
	});
}

// 比较版本号
export function compareVersion(v2) {
	let {
		SDKVersion: v1
	} = uni.getSystemInfoSync();
	v1 = v1.split(".");
	v2 = v2.split(".");
	const len = Math.max(v1.length, v2.length);

	while (v1.length < len) {
		v1.push("0");
	}
	while (v2.length < len) {
		v2.push("0");
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i]);
		const num2 = parseInt(v2[i]);

		if (num1 > num2) {
			return 1;
		} else if (num1 < num2) {
			return -1;
		}
	}

	return 0;
}


export function goOrderDetails(id, type, isPreSale) {
	console.log(isPreSale)
	// 创建订单时跳转到详情
	if (!isPreSale) {
		if (type == 'create') {
			_router.replace({
				path: "/pages/order/MyOrder/index",
				query: {
					/* id */
				},
			});

		}
	} else {
		_router.replace({
			path: "/pages/order/Distribution/index",
			query: {
				/* id */
			},
		});
	}

}
