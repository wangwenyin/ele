<template>
  <div>
    <myHeader :seller="seller"></myHeader>
    <div class="tab border-1px">
      <div class="tab-item">
        <!--生成路由链接的a标签-->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!--用来标识显示当前路由组件的标签-->
    <!--属性会传给所有管理的路由组件-->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import axios from 'axios'
  import myHeader from './components/header/header.vue'
  export default{
    components: {
      myHeader
    },
    data () {
      return {
        seller: {}//不能null
      }
    },
    // 使用axios发送ajax请求mockjs提供的接口
    created(){
      axios.get('/api2/seller')
        .then(response =>{
          let result = response.data
          console.log(result)
          
          if(result.errCode === 0){
            this.seller = result.data
          }
        })
    }
    
  }
</script>

<!--1.router-link路由标签生成的a链接默认会有class：router-link-active，可在路由配置里简写设置为linkActiveClass:'active',
2.stylus写样式可以省略{}和：，less不能
3.设计图上标的都是物理像素，对于dpr为2的设备，样式的css像素得除2，即一个css像素对应两个物理像素，dpr越大，分辨率越高

-->
<style lang="stylus" rel="stylesheet/stylus">
@import "./common/stylus/mixin.styl"
.tab
  display flex
  height 40px
  line-height 40px
  text-align center
  font-size 14px
  border-1px(rgba(7,17,27,.1))//混合
  .tab-item
    flex 1/*等分布局，在主轴上*/
    & >a
      display block
      text-decoration none
      color rgb(77,85,93)
      &.active
        color: rgb(240,20,20)
</style>
