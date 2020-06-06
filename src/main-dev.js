import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/font/iconfont.css'
// A table (with tree-grid) 
import ZkTable from 'vue-table-with-tree-grid'

// 导入富文本
import VueQuillEditor from 'vue-quill-editor'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'
// 配置api请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 添加请求拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done();
  return config
})

// 时间过滤器
Vue.filter('dateFormat', function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.use(VueQuillEditor)

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', ZkTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
