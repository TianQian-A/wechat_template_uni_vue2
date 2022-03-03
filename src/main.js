import Vue from 'vue'
import App from './App'
import store from './store';
import dayjs from 'dayjs'; // Day.js 是一个轻量的处理时间和日期的 JavaScript 库，文档： https://dayjs.gitee.io/docs/zh-CN/installation/installation
import './utils/normalPromise';

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$dayjs = dayjs;
const app = new Vue({
  ...App,
  store
})
app.$mount()
