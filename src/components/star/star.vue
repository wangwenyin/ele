<template>
  <div class="stars" :class="`star-${size}`">
    <span class="star" v-for="c in starClasses" :class="c"></span>
  </div>
</template>

<script>
  const CLASS_ON = 'on'
  const CLASS_HALF = 'half'
  const CLASS_OFF = 'off'
  
  export default{
    props:{
      score: Number,
      size: Number
    },
    data () {
      return {}
    },
    computed:{
      starClasses(){
        let starClasses = []
        let score = this.score
        let integerScore = Math.floor(score)
  
        // 向数组中添加CLASS_ON
        for (let i = 0; i < integerScore; i++) {
          starClasses.push(CLASS_ON)
        }
        if(score - integerScore>=0.5){
          starClasses.push(CLASS_HALF)
        }
        while (starClasses.length<5){
          starClasses.push(CLASS_OFF)
        }
        
        return starClasses
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  /*.stars-wrapper//后面要写成组件，以达到复用
    height 24px
    margin 16px 0 28px
    text-align center*/
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
            bg-img('./img/star48_on')//套用2x，3x的混合
          &.half
            bg-img('./img/star48_half')
          &.off
            bg-img('./img/star48_off')
      &.star-36
        .star
          width 15px
          height 15px
          margin-right 5px
          &:last-child
            margin-right 0
          &.on
            bg-img('./img/star36_on')
          &.half
            bg-img('./img/star36_half')
          &.off
            bg-img('./img/star36_off')
      &.star-24
        .star
          width 10px
          height 10px
          margin-right 2px
          &:last-child
            margin-right 0
          &.on
            bg-img('./img/star24_on')
          &.half
            bg-img('./img/star24_half')
          &.off
            bg-img('./img/star24_off')
</style>
