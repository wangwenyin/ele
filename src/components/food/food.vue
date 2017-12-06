<template>
  <transition name="move">
    <div class="food" v-show="isShow" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back">
            <i class="icon-arrow_lift" @click="toggleShow"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span> <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" :updateFoodCount="updateFoodCount"></cartcontrol>
          </div>
          <!--<div class="buy">加入购物车</div>-->
        </div>
      
        <split></split>
      
        <div class="info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
      
        <split></split>
      
        <div class="rating">
          <h1 class="title">商品评价</h1>
  
          <ratingselect
            :ratings="food.ratings"
            :selectType="selectType"
            :onlyContent="onlyContent"
            :desc="{all: '全部', positive: '推荐', negative: '吐糟'}"
            :toggleOnlyContent="toggleOnlyContent"
            :setSelectType="setSelectType">
          </ratingselect>
          
          <div class="rating-wrapper">
            <ul>
              <li class="rating-item border-1px" v-for="rating in filterRatings">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img width="12" height="12" :src="rating.avatar" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | date-string}}</div>
                <p class="text">
                  <span :class="rating.rateType===0 ? 'icon-thumb_up' : 'icon-thumb_down'"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-if="food.ratings" v-show="food.ratings.length===0">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'
  
  export default{
    props: {
      food :Object,
      updateFoodCount: Function
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    },
    data () {
      return {
        isShow: false,
        selectType: 2,//全部  // rating.rateType(0/1)
        onlyContent: true// 是否只看有内容的  //rating.text
      }
    },
    methods: {
      //切换显示food详情
      toggleShow(){
        this.isShow = !this.isShow
        
        if(this.isShow){
          this.$nextTick(function () {
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.food,{
                click:true
              })
            }else {
              this.scroll.refresh()
            }
          })
        }
      },
      //传递评论类型
      setSelectType(selectType){
        this.selectType = selectType
        this.$nextTick(() => {
          this.scroll.refresh()//评论列表变化时，通知scroll对象更新
        })
      },
      toggleOnlyContent(){
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    computed: {
      filterRatings(){
        let ratings = this.food.ratings
        if(ratings){//防止开始数据没拿到而报错
          let {selectType,onlyContent} = this
  
          return ratings.filter(rating =>{
            let {rateType,text} = rating
    
            /*
             selectType: 0/1/2   如果是0/1需要判断是否与rating.rateType相等, 如果是2就不需要
             onlyContent: true/false  如果为true需要判断rating.text必须有值, 如果是false就不需要
             */
            //点击按钮，对评论进行过滤
            if(selectType === 2){
              return !onlyContent || rating.text.length > 0
            }else {
              return selectType === rateType && (!onlyContent || rating.text.length > 0)
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    
    &.move-enter-active, &.move-leave-active
      transition: all .2s linear
    &.move-enter, &.move-leave-to
      transform: translateX(100%)
    
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        &.fade-transition
          transition: all 0.2s
          opacity: 1
        &.fade-enter, &.fade-leave
          opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
