import request from "@/utils/request";

/**
 * 统计数据
 */
export function getStatisticsInfo() {
  return request.get("/mall/admin/order/statistics", {}, { login: true });
}
/**
 * 订单月统计
 */
export function getStatisticsMonth(where) {
  return request.get("/mall/admin/order/data", where, { login: true });
}
/**
 * 订单月统计
 */
export function getAdminOrderList(where) {
  return request.get("/mall/admin/order/list", where, { login: true });
}
/**
 * 订单改价
 */
export function setAdminOrderPrice(data) {
  return request.post("/mall/admin/order/price", data, { login: true });
}
/**
 * 订单备注
 */
export function setAdminOrderRemark(data) {
  return request.post("/mall/admin/order/remark", data, { login: true });
}
/**
 * 订单详情
 */
export function getAdminOrderDetail(orderId) {
  return request.get("/mall/admin/order/detail/" + orderId, {}, { login: true });
}
/**
 * 订单发货信息获取
 */
export function getAdminOrderDelivery(orderId) {
  return request.get(
    "/admin/order/detail/" + orderId,
    {},
    { login: true }
  );
}

/**
 * 订单发货保存
 */
export function setAdminOrderDelivery(data) {
  return request.post("/mall/admin/order/delivery/keep", data, { login: true });
}
/**
 * 订单统计图
 */
export function getStatisticsTime(data) {
  return request.get("/mall/admin/order/time", data, { login: true });
}
/**
 * 线下付款订单确认付款
 */
export function setOfflinePay(data) {
  return request.post("/mall/admin/order/offline", data, { login: true });
}
/**
 * 订单确认退款
 */
export function setOrderRefund(data) {
  return request.post("/mall/admin/order/refund", data, { login: true });
}
