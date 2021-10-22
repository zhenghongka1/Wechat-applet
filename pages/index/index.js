import { request } from '../../request/request'

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航栏数组
    catesList:[],
    // 楼层数据
    floorList:[]
  },
  onLoad: function () {
    // 容易造成回调地狱
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     // console.log(result);
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },
    // })

    this.getSwiper();
    this.getCateList();
    this.getfloorList();
},
// 获取轮播图数据
getSwiper(){
    // 使用Promise简化操作
    request({ url: '/home/swiperdata' }).then(res => {
      this.setData({
        swiperList: res.data.message
      })
    })
},
// 获取导航栏数据
getCateList(){
      // 使用Promise简化操作
      request({ url: '/home/catitems' }).then(res => {
        this.setData({
          catesList: res.data.message
        })
      })
},
// 获取楼层栏数据
getfloorList(){
      // 使用Promise简化操作
      request({ url: '/home/floordata' }).then(res => {
        this.setData({
          floorList: res.data.message
        })
      })
}
  
})