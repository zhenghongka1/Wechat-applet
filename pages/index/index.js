import { request } from '../../request/request'

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航栏数组
    catesList: [],
    // 楼层数据
    floorList: []
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
  getSwiper() {
    // 使用Promise简化操作
    request({ url: '/home/swiperdata' }).then(result => { 
      // console.log(result);
      const res = result.data.message
      res.forEach((v, i) => {res[i].navigator_url = v.navigator_url.replace('main', 'index');});
      this.setData({
        swiperList: res
      })
    })

  },
  // 获取导航栏数据
  getCateList() {
    // 使用Promise简化操作
    request({ url: '/home/catitems' }).then(res => {
      this.setData({
        catesList: res.data.message
      })
    })
  },
  // 获取楼层栏数据
  getfloorList() {
    // 使用Promise简化操作
    request({ url: '/home/floordata' }).then(result => {
      const res = result.data.message
      console.log(res);
      for (let k = 0; k < res.length; k++) {
        res[k].product_list.forEach((v, i) => {
            res[k].product_list[i].navigator_url = v.navigator_url.replace('?', '/index?');
        });
    }
      this.setData({
        floorList: res
      })
    })
  }

})