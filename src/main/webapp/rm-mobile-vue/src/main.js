// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App'
import routes from './routes'
import store from './store/store'
import FastClick from 'fastclick'
import Axios from 'axios'
import appConfig from './appConfig'
import filter from './filter'
import {scrollRecord} from './route-data/'
import {getRMUser} from './utils/users'
import Icon from 'vue-awesome/components/Icon'

Vue.directive('scroll-record', scrollRecord)
/* eslint-disable no-new */
Object.keys(filter).forEach(k => Vue.filter(k, filter[k]))
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(appConfig)
Vue.component('icon', Icon)
// const eventHub = new Vue()
// 创建一个路由对象用于管理页面的路由
const router = new VueRouter({
  // mode: 'history',
  history: false,
  routes: routes
})

//  配置axios全局参数： 默认超时，请求拦截，响应拦截
Axios.defaults.timeout = 12000 // 设置默认请求超时
Axios.interceptors.request.use(config => {
  // store.dispatch('UPDATE_LOADING', true)
  store.dispatch('UPDATE_AXIOS', true)
  return config
})
Axios.interceptors.response.use(response => {
  store.dispatch('UPDATE_AXIOS', false)
  // store.dispatch('UPDATE_LOADING', false)
  if ((response.status >= 200 && response.status < 300) || response.status === 304) {
    if (response.data.status === 'fail') {
      // store.dispatch('UPDATE_NETWORK', true)
    }
    return response.data
  }
  return Promise.reject(new Error(response.status))
}, error => {
  // Do something with response error
  store.dispatch('UPDATE_AXIOS', false)
  store.dispatch('UPDATE_NETWORK', true)
  // store.dispatch('UPDATE_LOADING', false)
  Vue.prototype.$toast({
    msg: '加载失败',
    time: 2000,
    type: 'warn'
  })
  return Promise.reject(error)
})
Vue.prototype.$axios = Axios
// 路由切换状态

FastClick.attach(document.body)
router.beforeEach((to, from, next) => {
  if (!store.state.userInfo) {
    if (process.env.NODE_ENV === 'development') {
      let user = {
        departments: ['0029000000'],
        departmentName: '金域蓝湾',
        departmentId: '0036039070',
        department: '深圳金域蓝湾',
        companyName: '深圳万科物业服务有限公司海南分公司',
        id: 1000030060, // 1000108464
        jobId: '50387079',
        jobName: '业务支持系统负责人',
        name: '佘家强',
        sapJobId: '50387079',
        sapJobName: '公共维修',
        mobile: '13554851736'
      }
      store.dispatch('UPDATE_USERINFO', user)
      next()
    } else {
      // 用户权限
      let rmUser = getRMUser()
      Axios.get(Vue.prototype.$appConfig.api.authority + rmUser.loginMobile)
        .then(res => {
          let user = res
          user.mobile = rmUser.loginMobile
          user.token = rmUser.token
          user.approval = true
          store.dispatch('UPDATE_USERINFO', user)
          next()
        })
    }
  } else {
    next()
  }
  store.dispatch('UPDATE_LOADING', false)
})
router.afterEach(() => {
  store.dispatch('UPDATE_NETWORK', false)
})
window.__lendApp__ = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
