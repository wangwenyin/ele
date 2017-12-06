import Mock from 'mockjs'
import data from './data.json'

// 映射路由
Mock.mock('/api2/goods', {
  errCode: 0,
  data: data.goods
})
Mock.mock('/api2/ratings', {
  errCode: 0,
  data: data.ratings
})
Mock.mock('/api2/seller', {
  errCode: 0,
  data: data.seller
})

// export default ???   不需要暴露什么东西
