import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
import cookie from '@/utils/store/cookie'
import { getUserInfo, getUser } from '@/api/user'
import dialog from '@/utils/dialog'
const loginKey = 'login_status'
const store = new Vuex.Store({
	namespaced: true,
	// state
	state: {
		// 用户信息
		/* userInfo: null, */
		phoneNoInfo: null,
		nickname: '',
		member: null,
		noDeliveryTime: null,
		registerForm: null,
		userInfoForm: null,
		receivingForm: null,
		// 是否已经在授权页面
		isAuthorizationPage: false,
		// 是否授权
		isAuthorization: false,
		// 不建议从这里取 token，但是删除掉会影响其他的页面
		token: cookie.get(loginKey) || null,
		userInfo: cookie.get('userInfo'),
		$deviceType: null,
		location: {
		  latitude: '',
		  longitude: '',
		},
		storeItems: cookie.get('storeItems') || null,
		goName: cookie.get('goName') || '',

	},
	strict: debug,
	// getters
	getters: {
		isAuthorizationPage: state => state.isAuthorizationPage,
		isAuthorization: state => state.isAuthorization,
		token: state => state.token,
		isLogin: state => !!state.token,
		userInfo: state => state.userInfo || {},
		location: state => state.location,
		storeItems: state => state.storeItems,
		goName: state => state.goName,
		$deviceType: state => state.$deviceType,
		getReceivingForm(state) {
			return state.receivingForm
		},
		getUserInfo(state) {
			return state.userInfo
		},
		getPhoneNoInfo(state) {
			return state.phoneNoInfo
		},
		getUserInfoForm(state) {
			return state.userInfoForm
		},
		getNickname(state) {
			return state.nickname
		},
		getMember(state) {
			return state.member
		},
		getNoDeliveryTime(state) {
			return state.noDeliveryTime
		},
		getRegisterForm(state) {
			return state.registerForm
		}

	},
	// mutations
	mutations: {
		login(state, token, expires_time) {
		  state.token = token
		  cookie.set(loginKey, token, expires_time)
		},
		logout(state) {
		  console.log('清除数据')
		  state.token = null
		  state.userInfo = null
		  cookie.clearAll()
		},
		backgroundColor(state, color) {
		  state.color = color
		  // document.body.style.backgroundColor = color;
		},
		updateUserInfo(state, userInfo) {
		  state.userInfo = userInfo
		  if (userInfo) {
		    cookie.set('userInfo', userInfo)
		  } else {
		    cookie.set('userInfo', null)
		  }
		},
		updateAuthorizationPage(state, isAuthorizationPage) {
		  state.isAuthorizationPage = isAuthorizationPage
		},
		updateAuthorization(state, isAuthorization) {
		  state.isAuthorization = isAuthorization
		},
		updateDevicetype(state, $deviceType) {
		  state.$deviceType = $deviceType
		},
		setLocation(state, location) {
		  state.location = location
		},
		get_store(state, storeItems) {
		  state.storeItems = storeItems
		  cookie.set('storeItems', storeItems)
		},
		get_to(state, goName) {
		  state.goName = goName
		  cookie.set('goName', goName)
		},
		ADD_RECEIVING_FORM(state, receivingForm) {
			state.receivingForm = receivingForm
		},
		ADD_USER_INFO(state, userInfo) {
			state.userInfo = userInfo
		},
		ADD_PHONEN_NO_INFO(state, phoneNoInfo) {
			state.phoneNoInfo = phoneNoInfo
		},
		ADD_USER_INFO_FORM(state, userInfoForm) {
			state.userInfoForm = userInfoForm
		},
		ADD_NICKNAME(state, nickname) {
			state.nickname = nickname
		},
		ADD_MEMBER(state, member) {
			state.member = member
		},
		ADD_NO_DELIVERY_TIME(state, noDeliveryTime) {
			state.noDeliveryTime = noDeliveryTime
		},
		ADD_REGISTER_FORM(state, registerForm) {
			state.registerForm = registerForm
		},
	},
	// actions
	actions: {
		addReceivingForm(context, receivingForm) {
			context.commit('ADD_RECEIVING_FORM', receivingForm)
		},
		addUserInfo(context, userInfo) {
			context.commit('ADD_USER_INFO', userInfo)
		},
		addPhoneNoInfo(context, phoneNoInfo) {
			context.commit('ADD_PHONEN_NO_INFO', phoneNoInfo)
		},
		addUserInfoForm(context, userInfoForm) {
			context.commit('ADD_USER_INFO_FORM', userInfoForm)
		},
		addNickname(context, nickname) {
			context.commit('ADD_NICKNAME', nickname)
		},
		addMember(context, member) {
			context.commit('ADD_MEMBER', member)
		},
		addNoDeliveryTime(context, noDeliveryTime) {
			context.commit('ADD_NO_DELIVERY_TIME', noDeliveryTime)
		},
		addRegisterForm(context, registerForm) {
			context.commit('ADD_REGISTER_FORM', registerForm)
		},
		getLocation({ state, commit }, force) {
		  uni.getLocation({
		    type: 'gcj02',
		    success: function(res) {
		      console.log(res)
		      commit('setLocation', {
		        longitude: res.longitude,
		        latitude: res.latitude,
		      })
		    },
		  })
		},
		userInfo({ state, commit }, force) {
		  if (state.userInfo !== null && !force) {
		    return Promise.resolve(state.userInfo)
		  }
		  return new Promise(reslove => {
		    getUserInfo().then(res => {
		      commit('updateUserInfo', res.data)
		      reslove(res.data)
		    })
		  }).catch(() => {
		    uni.showToast({
		      title: '获取信息失败!',
		      icon: 'none',
		      duration: 2000,
		    })
		  })
		},
		getUser({ state, commit }) {
		  if (!state.token) {
		    return Promise.reject('未获取到token')
		  }
		  return new Promise(reslove => {
		    getUserInfo().then(res => {
		      console.log(res)
		      commit('updateUserInfo', res.data)
		      reslove(res.data)
		    })
		  }).catch(error => {
		    console.log(error)
		    uni.showToast({
		      title: '获取信息失败!',
		      icon: 'none',
		      duration: 2000,
		    })
		  })
		},
		changeLogin({ state, commit }, data, date) {
		  commit('login', data, date)
		},
		setUserInfo({ state, commit }, user) {
		  commit('updateUserInfo', user)
		},
		changeAuthorizationPage({ state, commit }, index) {
		  commit('updateAuthorizationPage', index)
		},
		changeAuthorization({ state, commit }, index) {
		  commit('updateAuthorization', index)
		},
	}
})
export default store;
