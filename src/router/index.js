/**
 * Created by hp on 2017/9/27.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import goods from '../components/goods/goods.vue'
import ratings from '../components/ratings/ratings.vue'
import seller from '../components/seller/seller.vue'

// 声明使用插件
Vue.use(VueRouter)

//默认暴露的对象可以直接用变量接收，不需要{}解构赋值
export default new VueRouter({
  linkActiveClass:'active',//给激活的a链接一个class样式
  //配置多个路由
  routes:[
    {
      path:'/goods',
      component:goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    },
    { //默认路由
      path:'/',
      redirect:'/goods'
    }
  ]
})
