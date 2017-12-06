import Vue from 'vue'
// import moment from 'moment'
import VueScroller from 'vue-scroller'//使用vue的滚动插件，用法比better-scroll简单，但没横向滚动
import VueLazyload from 'vue-lazyload'
import {format} from 'date-fns'//使用date-fns（库），可以按需引入，比moment更轻量
import {Button} from 'mint-ui'//按需引入

import app from './app.vue'
import router from './router' //会直接找index文件
import './mock/mockServer'
import './common/stylus/index.styl'

import loading from './common/loadingImg/timg.gif'

// 注册全局过滤器
Vue.filter('date-string', function (value) { // 被处理的时间值
  // return moment(value).format('YYYY-MM-DD HH:mm:ss')
  return format(value,'YYYY-MM-DD HH:mm:ss')
})

// 注册全局组件
Vue.component(Button.name, Button)
/*或写为
Vue.use(Button)*/


//声明使用插件
Vue.use(VueScroller)
Vue.use(VueLazyload, {
  loading
})

new Vue({
  el: '#app',
  render: h=> h(app),
  router //配置路由器
})
