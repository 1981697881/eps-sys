/*
 * 订单确认
 * */
import request from "@/utils/request";

/**
 * 通过购物车 id 获取订单信息
 * @param cartId
 * @returns {*}
 */
export function postOrderConfirm(cartId,isNo) {
	return request.post("/mall/order/confirm", {
		cartId:cartId,
		isNo: isNo
	});
}

/**
 * 计算订单金额
 * @param key
 * @param data
 * @returns {*}
 */
export function postOrderComputed(key, data) {
	return request.post("/mall/order/computed/" + key, data);
}

/**
 * 获取指定金额可用优惠券
 * @param price
 * @returns {*}
 */
export function getOrderCoupon(cartId) {
	return request.get("/mall/coupons/order/" + cartId);
}

/**
 * 生成订单
 * @param key
 * @param data
 * @returns {*}
 */
export function createOrder(data) {
	return request.post("/mall/order/create", data || {});
}

/**
 * 订单统计数据
 * @returns {*}
 */
export function getOrderData() {
	return request.get("/mall/order/data");
}

/**
 * 订单列表
 * @returns {*}
 */
export function getOrderList(data) {
	return request.get("/mall/order/list", data);
}

/**
 * 预售订单列表
 * @returns {*}
 */
export function getYsOrderList(data) {
	return request.get("/mall/order/yuShouList", data);
}

/**
 * 取消订单
 * @returns {*}
 */
export function cancelOrder(id) {
	return request.post("/mall/order/cancel", {
		id
	});
}

/**
 * 订单详情
 * @returns {*}
 */
export function orderDetail(id) {
	return request.get("/mall/order/detail/" + id);
}

/**
 * 退款理由
 * @returns {*}
 */
export function getRefundReason() {
	return request.get("/mall/order/refund/reason");
}

/**
 * 提交退款
 * @returns {*}
 */
export function postOrderRefund(data) {
	return request.post("/mall/order/refund/verify", data);
}

/**
 * 确认收货
 * @returns {*}
 */
export function takeOrder(uni) {
	return request.post("/mall/order/take", {
		uni
	});
}

/**
 * 删除订单
 * @returns {*}
 */
export function delOrder(uni) {
	return request.post("/mall/order/del", {
		uni
	});
}

/**
 * 订单查询物流信息
 * @returns {*}
 */
export function express(params) {
	return request.post("/mall/order/express", params);
}

/**
 * 订单查询物流信息
 * @returns {*}
 */
export function payOrder(uni, paytype, from) {
	return request.post("/mall/order/pay", {
		uni,
		paytype,
		from
	});
}
/**
 * 订单核销
 * @returns {*}
 */

export function orderVerific(verifyCode, isConfirm) {
	return request.post("/mall/order/order_verific", { verifyCode, isConfirm });
}
/**
 * 查询配送计划
 * @returns {*}
 */
export function findPoject(params) {
	return request.post("/mall/order/findPoject ", {params});
}
/**
 * 设置配送计划
 * @returns {*}
 */
export function setPoject(params) {
	return request.post("/mall/order/setPoject ", params);
}
/**
 * 配送计划明细
 * @returns {*}
 */
export function pojectDetail(params) {
	return request.post("/mall/order/pojectDetail ", params);
}
/**
 * 停止配送计划
 * @returns {*}
 */
export function stopPojectOd(params) {
	return request.post("/mall/order/stopPojectOd ", params);
}
