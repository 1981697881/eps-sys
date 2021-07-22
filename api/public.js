import request from '@/utils/request'

/**
 * 首页
 * @returns {*}
 */
export function getHomeData() {
  return request.get('/mall/shopindex/index', {}, { login: false })
}

// TODU
/**
 * 首页
 * @returns {*}
 */
export function getCanvas() {
  return request.get('/mall/shopindex/getCanvas?terminal=3', {}, { login: false })
}

/**
 * 文章 轮播列表
 * @returns {*}
 */
export function getArticleBanner() {
  return request.get('/mall/article/banner/list', {}, { login: false })
}

/**
 * 文章分类列表
 * @returns {*}
 */
export function getArticleCategory() {
  return request.get('/mall/article/category/list', {}, { login: false })
}

/**
 * 文章 热门列表
 * @returns {*}
 */
export function getArticleHotList() {
  return request.get('/mall/article/hot/list', {}, { login: false })
}

/**
 * 文章列表
 * @returns {*}
 */
export function getArticleList(q) {
  return request.get('/weixin/article/list', q, { login: false })
}

/**
 * 分享
 * @returns {*}
 */
export function getShare() {
  return request.get('/weixin/share', {}, { login: false })
}

/**
 * 文章详情
 * @returns {*}
 */
export function getArticleDetails(id) {
  return request.get('/weixin/article/details/' + id, {}, { login: false })
}

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function getWechatConfig() {
  return request.get('/weixin/wechat/config', { url: location.href }, { login: false })
}

/**
 * 公众号授权登录
 * @returns {*}
 */
export function wechatAuth(code, spread, login_type) {
  return request.get('/auth/oauth/wechatLogin', { code, spread, login_type }, { login: false })
}
/**
 * 获取快递公司
 * @returns {*}
 */
export function getLogistics() {
  return request.get('/mall/logistics', {}, { login: false })
}

/**
 * 获取图片base64
 * @retins {*}
 * */
export function imageBase64(image, code) {
  return request.post('/mall/shopindex/image_base64', { image: image, code: code }, { login: false })
}
/**
 * 兑换优惠券
 * @retins {*}
 * */
export function exchange(params) {
  return request.post('/mall/coupon/exchange', params, { login: true })
}
