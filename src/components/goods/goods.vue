<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li class="menu-item" v-for="(good,index) in goods" :class="{current:currentIndex === index}" @click="clickMenuItem(index)">
          <span class="text border-1px">
              <span class="icon" v-if="good.type>=0" :class="supportClasses[good.type]"></span>{{good.name}}
          </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <div>
          <div class="top-tip">
            <span class="refresh-hook">下拉刷新</span>
          </div>
          <ul>
            <li class="food-list food-list-hook" v-for="good in goods">
              <h1 class="title">{{good.name}}</h1>
              <ul>
                <li class="food-item border-1px" v-for="food in good.foods" @click="showFood(food)">
                  <div class="icon">
                    <img width="57" height="57" v-lazy="food.icon">
                  </div>
          
                  <div class="content">
                    <h2 class="name">{{food.name}}</h2>
                    <p class="desc">{{food.description}}</p>
                    <div class="extra">
                      <span class="count">月售{{food.sellCount}}份</span>
                      <span>好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                      <cartcontrol :food="food" :updateFoodCount="updateFoodCount"></cartcontrol>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <div class="bottom-tip">
            <span class="loading-hook">查看更多</span>
          </div>
        </div>
      </div>
      <shopcart :minPrice="seller.minPrice"
                :deliveryPrice="seller.deliveryPrice"
                :foods="cartFoods"
                :clearCart="clearCart"
                :updateFoodCount="updateFoodCount"
                ref="shopcart">
      </shopcart>
    </div>
    <food :food="food" :updateFoodCount="updateFoodCount" ref="food"></food>
  </div>
</template>

<script>
  import axios from 'axios'
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import shopcart from '../shopcart/shopcart.vue'
  import food from '../food/food.vue'
  //MessageBox, Toast不是组件，是函数对象，需在这里使用，故只能在这里引入
  import { MessageBox, Toast} from 'mint-ui'
  
  export default{
    props:{
      seller:Object
    },
    components: {
      cartcontrol,
      shopcart,
      food
    },
    data () {
      return {
        goods: [],
        supportClasses: ['decrease', 'discount', 'guarantee', 'invoice', 'special'],
        scrollY: 0, //滚动的y坐标
        tops: [],  // li的top的数组
        food: {}
      }
    },
    created(){
      axios.get('/api2/goods')
        .then(response =>{
          let result = response.data
          console.log(result)
          
          if(result.errCode === 0){
            this.goods = result.data
          }
  
          /*setTimeout(() => {
           this._initScroll()
           }, 100)*/
          // 将回调延迟到下次 DOM 更新循环之后执行
          this.$nextTick(() => {
            this._initScroll()
            this._initTops()
          })
        })
    },
    methods: {
      //不是dom事件，加_区别一下
      _initScroll () {
        // 创建对应左侧分类列表的scroll对象
        //通过对应的ref找到dom元素
        new BScroll(this.$refs.menuWrapper,{
          click:true//better-scroll默认禁止了原生点击事件
        })
        // 创建对应右侧食物列表的scroll对象
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{//配置对象
          probeType: 2, //会在屏幕滑动(只能是用户操作)的过程中实时的派发 scroll 事件
          click:true,
          threshold: 50,
          stop: 20
        })
  
        //绑定指定名称(滚动)的事件监听
        this.foodsScroll.on('scroll',event => {
//          console.log(event.y)
          this.scrollY = Math.abs(event.y)
        })
        this.foodsScroll.on('scrollEnd', event => { // 滚动结束时回调
//          console.log('scrollEnd', event.y)
          this.scrollY = Math.abs(event.y)
        })
      },
      //把左侧foodList里的li的top添加到tops数组里
      _initTops(){
        let tops = []
        let lis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        // 根据lis添加top
        let top = 0 //第一个li的top
        tops.push(top)
        ;[].slice.call(lis).forEach(li =>{
          top += li.clientHeight
          tops.push(top)
        })
        // 更新tops
        this.tops = tops
//        console.log(tops);
      },
      //点击左侧li，右侧滑动
      clickMenuItem (index) {
        //取得对应的li
        const li = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')[index]
        // 右侧滑动到对应的位置(better-scroll的scrollToElement()方法)
        this.foodsScroll.scrollToElement(li, 300)
        // 更新scrollY
        this.scrollY = this.tops[index]
      },
      
      updateFoodCount(isAdd,food,event){
//        console.log('updateFoodCount()')
        if(isAdd){//增加
          if(!food.count){
//            food.count = 1 // 给food添加一个新的属性, 没有数据绑定(只在内存里，没显示到页面)
            this.$set(food,'count',1)//数据绑定
          }else {
            food.count += 1
          }
          // 启动一个小球动画
          //父组件调用子组件方法（ref）
          //传入event，event.target就是小球开始动画的位置
          this.$refs.shopcart.startBallAnimation(event.target)
        }else{
          if(food.count){
            food.count--
          }
        }
      },
      //理解：要操作的数据在哪，方法就定义在哪（调用可以在其它组件）
      clearCart () {// 将cartFoods中的所有food的count=0
        /*if(confirm('确定要清除购物车吗？')){
          this.cartFoods.forEach(food => {
            food.count = 0
          })
        }*/
        //mint-ui的消息提示样式
        MessageBox.confirm('确定要清除购物车吗？').then(action => {
//          console.log(action)
          this.cartFoods.forEach(food => {
            food.count = 0
          })
          Toast({
            message: '清除成功',
            position: 'middle',
            duration: 2000
          })
        }, () => {
          // 处理取消的逻辑
        })
      },
      //点击food列表显示food详情
      showFood(food){
        //更新food
        this.food = food
        // 显示food界面
        //父组件调用子组件的方法-需通过ref获取子组件来调用（子调父通过props属性传递）
        this.$refs.food.toggleShow()
      }
    },
    
    computed:{
      //分析currentIndex需用计算属性得到
      currentIndex(){
        const {scrollY, tops} = this
  
        // 从tops中根据scrollY找出对应的下标(注意：scrollY应该是在一段范围内)
        
        // 命令式编程
        /*for (var i = 0; i < tops.length; i++) {
         var top = tops[i]
         var nextTop = tops[i+1]
         if(scrollY>=top && scrollY<nextTop) {
         return i
         }
         }*/
        // 声明式编程(使用数组的方法)
        // tops.indexOf(scrollY) 这是唯一的，所以不能用indexOf
        //findIndex() 方法返回数组中满足条件的第一个元素的 索引 。否则返回-1。
        return tops.findIndex((top,index) =>{
          let nextTop = tops[index+1]
          return scrollY>=top && scrollY<nextTop
        })
      },
      //购物车里的food需根据其count>0而来
      cartFoods(){
        let foods = []
        this.goods.forEach(good =>{
          good.foods.forEach(food =>{
            if(food.count>0){
              foods.push(food)
            }
          })
        })
        return foods
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-img('./img/decrease_3')
          &.discount
            bg-img('./img/discount_3')
          &.guarantee
            bg-img('./img/guarantee_3')
          &.invoice
            bg-img('./img/invoice_3')
          &.special
            bg-img('./img/special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
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
            right: 0
            bottom: 12px
</style>

