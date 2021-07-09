import Vue from 'vue'
import App from './App'
import http from './utils/http.js'
import monent from './libs/moment.js'
import api from './config/api.js'
import './utils/filters'
//商城 ---start 
import store from './store'
import schema from 'async-validator'
import dialog from './utils/dialog'
import cookie from '@/utils/store/cookie'
import cuCustom from '@/static/colorui/components/cu-custom.vue'
import { parseRoute, _router, parseQuery } from '@/utils'
import { VUE_APP_RESOURCES_URL, VUE_APP_API_URL } from '@/config'
Vue.component('cu-custom', cuCustom)
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)
Vue.config.devtools = process.env.NODE_ENV !== 'production'
Vue.prototype.$validator = function(rule) {
  return new schema(rule)
}
//商城 ---end 

Vue.prototype.$store = store
Vue.config.productionTip = false

Vue.prototype.$http = http;
Vue.prototype.$api = api;
Vue.prototype.$uni = uni;
Vue.prototype.$monent = monent;
App.mpType = 'app'
Vue.prototype.$msgTempId = "0IEVENpd46GRVLNXLj9c0OihnZF-0vgzEXosViv5SXo"


const app = new Vue({
    ...App,
	store
})
//商城 ---start
Object.defineProperty(Vue.prototype, '$yrouter', {
  get() {
    return _router
  },
})

Object.defineProperty(Vue.prototype, '$yroute', {
  get() {
    return this._route
  },
})
Vue.prototype.$VUE_APP_API_URL = VUE_APP_API_URL
Vue.component('cu-custom', cuCustom)

let deviceType = ''
// #ifdef APP-PLUS
// App平台编译的代码
deviceType = 'app'
Vue.prototype.$platform = uni.getSystemInfoSync().platform
// #endif

// #ifdef MP-WEIXIN
// 微信小程序编译的代码
deviceType = 'routine'
// #endif

// !!! ps  不建议在 template 中使用 $deviceType 去判断当前环境，很有可能出现 $deviceType 为 undefined 导致判断出错的问题，可以在 script 模块中正常使用
// 建议通过 store 去获取 $deviceType 可以保证 template 中取到的值有效
// import { mapState, mapMutations, mapActions } from 'vuex';
// computed: {
// 		...mapState(['$deviceType'])
// },

// #ifdef H5
// H5编译的代码

import { wechat, clearAuthStatus, oAuth, auth, toAuth, pay, openAddress, openShareAll, openShareAppMessage, openShareTimeline, wechatEvevt, ready, wxShowLocation } from '@/libs/wechat'

import { isWeixin } from '@/utils'
const CACHE_KEY = 'clear_0.0.1'

if (!cookie.has(CACHE_KEY)) {
  cookie.clearAll()
  cookie.set(CACHE_KEY, 1)
}

var urlSpread = parseQuery()['spread']
if (urlSpread) {
  cookie.set('spread', urlSpread)
}

// #endif

// #ifdef H5
// H5编译的代码
// 判断是否是微信浏览器
async function init() {
  if (isWeixin()) {
    deviceType = 'weixin'
    let wechatInit = wechat()
    if (wechatInit) {
      await oAuth()
    }
  } else {
    deviceType = 'weixinh5'
  }
}
init()
// #endif

Vue.prototype.$deviceType = deviceType

Vue.mixin({
  onLoad() {
    const { $mp } = this.$root
    this._route = parseRoute($mp)
  },
  onShow() {
    _router.app = this
    _router.currentRoute = this._route
  },
  // 这里为了解决 .vue文件中 template 无法获取 VUE.prototype 绑定的变量
  computed: {
    $VUE_APP_RESOURCES_URL() {
      return VUE_APP_RESOURCES_URL
    },
  },
})

store.commit('updateDevicetype', deviceType)
//商城 ---end
app.$mount()
