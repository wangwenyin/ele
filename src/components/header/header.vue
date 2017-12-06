<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img v-lazy="seller.avatar" >
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="supportClasses[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
        <div class="supports-count" v-if="seller.supports" @click="toggleShow">
          <span class="count">{{seller.supports.length}}个</span>
          <span class="icon-keyboard_arrow_right"></span>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="toggleShow">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="bg">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div class="mask" v-show="isShow">
        <div class="mask-wrapper"><!--粘连布局-->
          <div class="main">
            <h1>{{seller.name}}</h1>
            <div class="stars-wrapper">
              <star :score="seller.score" :size="36"></star>
            </div>
            <div class="info">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul class="list">
              <li v-for="support in seller.supports">
                <span class="icon" :class="supportClasses[support.type]"></span>
                <span>{{support.description}}</span>
              </li>
            </ul>
            <div class="info">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="context">
              <p class="text">
                {{seller.bulletin}}
            </p>
            </div>
          </div>
        </div>
        <div class="mask-footer" @click="toggleShow">
          <span class="icon-close"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import star from '../star/star.vue'
  
  export default{
    props:{
      seller: Object
    },
    components: {
      star
    },
    data () {
      return {
        isShow: false,
        supportClasses: ['decrease', 'discount', 'guarantee', 'invoice', 'special']
      }
    },
    methods:{
      toggleShow(){
        this.isShow = !this.isShow
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
.header
  position relative
  background rgba(7,17,27,.5)
  overflow hidden
  .content-wrapper
    position relative
    margin 24px 12px 18px 24px
    font-size 0 //里面用的都是inline-block（解决基线问题），里面每个都有单独的font-size
    .avatar
      display inline-block
      vertical-align top
      img
        width 64px
        height 64px
    .content
      display inline-block
      margin-left 16px
      .title
        margin 2px 0 8px 0
        .brand
          display inline-block
          vertical-align top
          width 30px
          height 18px
          background-repeat no-repeat
          background-size 100% 100%
          bg-img('./img/brand')//混合 且用到媒体查询
        .name
          margin-left 6px
          font-size 16px
          color rgb(255,255,255)
          font-weight bold
          line-height 18px
      .description
        font-size 12px
        line-height 12px
        color rgb(255,255,255)
        font-weight 200
      .supports
        margin 10px 0 2px 0
        .icon
          display inline-block
          width 12px
          height 12px
          background-repeat no-repeat
          background-size 100% 100%
          &.decrease //图片得根据从后台获取的数据（type类型）,从而绑定不同的类名来显示
            bg-img('./img/decrease_1')//混合前面已写好
          &.discount
            bg-img('./img/discount_1')
          &.guarantee
            bg-img('./img/guarantee_1')
          &.invoice
            bg-img('./img/invoice_1')
          &.special
            bg-img('./img/special_1')
        .text//根据设计图来写，不过这里应该是css像素
          vertical-align top
          margin-left 4px
          font-size 10px
          color rgb(255,255,255)
          font-weight 200px
          line-height 12px
      
          
      .supports-count
        position absolute
        right 0
        bottom 0
        background rgba(0,0,0,0.2)
        width 38px
        height 24px
        text-align center
        border-radius 12px
        .count
          line-height 24px
          font-size 10px
          color rgb(255,255,255)
          font-weight 200
        .icon-keyboard_arrow_right
          line-height 24px
          font-size 10px
          color rgb(255,255,255)
          font-weight 200
  
  .bulletin-wrapper
    position relative
    height 28px
    line-height 28px
    font-size 10px
    color rgb(255,255,255)
    font-weight 200
    padding 0 21px 0 12px
    background rgba(7,17,27,0.2)
    white-space nowrap //由于text是span，不便设在其身上，但这样text可以继承
    overflow hidden
    text-overflow ellipsis
    .bulletin-title
      margin-right  4px
      margin-top 8px
      vertical-align top
      display inline-block
      width 22px
      height 12px
      background-repeat no-repeat
      background-size 100% 100%
      bg-img('./img/bulletin')
    .icon-keyboard_arrow_right
      position absolute
      right 12px
      line-height 28px
    
  .bg
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    filter blur(10px) //背景图片的模糊效果
    z-index -1
  .mask//absolute:参照的是最近的开启了定位（包括relative）的祖先元素
    position fixed//fixed：始终参照的是相对于浏览器窗口（即初始包含块）进行定位的（跟absolute不一样）
    left 0
    top 0
    width 100%
    height 100%
    background rgba(7,17,27,0.8)
    z-index 99
    overflow auto//内容多的时候，出现滚动条
    &.fade-enter-active,&.fade-leave-active//通过vue添加过渡
      transition opacity .5s
    &.fade-enter,&.fade-leave-to
      opacity 0
    .mask-wrapper
      min-height 100%
      clear()//清浮动的混合
      .main
        overflow hidden//防止h1的margin-top被共享
        padding-bottom 64px
        h1
          text-align center
          font-size 16px
          color rgb(255,255,255)
          font-weight 700
          line-height 16px
          margin-top 64px
        .stars-wrapper//后面要写成组件，以达到复用
          height 24px
          margin 16px 0 28px
          text-align center
          .stars
            .star//每颗星的公共样式
              display inline-block
              background-size 100% 100%
              background-repeat no-repeat
            &.star-48//不同大小的星(写css的时候，各种不同的情况都写好)
              .star
                width 20px
                height 20px
                margin-right 20px
                &:last-child
                  margin-right 0
                &.on//先写成静态的，后面根据评分来动态生成不同的类名
                  bg-img('../star/img/star48_on')//套用2x，3x的混合
                &.half
                  bg-img('../star/img/star48_half')
                &.off
                  bg-img('../star/img/star48_off')
            &.star-36
              .star
                width 15px
                height 15px
                margin-right 15px
                &:last-child
                  margin-right 0
                &.on
                  bg-img('../star/img/star36_on')
                &.half
                  bg-img('../star/img/star36_half')
                &.off
                  bg-img('../star/img/star36_off')
            &.star-24
              .star
                width 10px
                height 10px
                margin-right 10px
                &:last-child
                  margin-right 0
                &.on
                  bg-img('../star/img/star24_on')
                &.half
                  bg-img('../star/img/star24_half')
                &.off
                  bg-img('../star/img/star24_off')
        .info
          width 80%
          margin 0 auto
          font-size 14px
          color rgb(255,255,255)
          display flex //让两边的线等分布局
          align-items center//(侧轴)是垂直居中
          .line
            flex 1
            width 0//兼容用的老版本flex的移动浏览器
            height 2px
            background rgba(255,255,255,0.2)
          .text
            margin 0 12px
        .list
          width 80%
          margin 24px auto 28px
          li
            font-size 12px
            font-weight 200
            color rgb(255,255,255)
            line-height 12px
            margin-bottom 12px
            &:last-child
              margin-bottom 0
            .icon
              vertical-align middle
              display inline-block
              background-size 100% 100%
              background-repeat no-repeat
              width 16px
              height 16px
              margin 0 6px 0 12px
              &.decrease //前面已写过，根据不同的类来绑定
                bg-img('./img/decrease_2')
              &.discount//也可不要&与icon同一级（这样写表示）
                bg-img('./img/discount_2')
              &.guarantee
                bg-img('./img/guarantee_2')
              &.invoice
                bg-img('./img/invoice_2')
              &.special
                bg-img('./img/special_2')
        .context
          width 80%
          margin 24px auto 0
          .text
            padding 0 12px
            font-size 12px
            line-height 24px
            font-weight 200
            color #eee
    .mask-footer
      margin-top -64px
      font-size 32px
      color rgba(255,255,255,.5)
      text-align center
</style>
