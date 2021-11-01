import { request } from '../../request/request'

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
    orders: []
  },
  // 封装tab
  changeTitleByIndex(index) {
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)

    this.setData({
      tabs
    })
  },
  // 点击tab根据index修改样式
  handleTabsItemChange(e) {
    // console.log(e);
    const { index } = e.detail
    // console.log(index);

    this.changeTitleByIndex(index)
    this.getOrders(index + 1)
  },
  // 1.获取url上的参数type
  onShow() {
    // 1.判断缓存中是否存在token，如果存在就显示，不存在就跳转到授权页面
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return
    }

    // console.log(options);  （Show不同与onLoad，无法在形参接受options）
    var curPages = getCurrentPages();
    // console.log(curPages);  （数组中最大索引就是当前页面）
    let { options } = curPages[curPages.length - 1]
    // 3.获取url上的type的参数
    const { type } = options
    // 4.根据选中的页面，激活当前的页面的active
    this.changeTitleByIndex(type - 1)
    this.getOrders(type)
  },
  // 2.获取订单列表
  async getOrders(type) {
    const res = await request({ url: '/my/orders/all', data: { type } })
    // console.log(res);
    this.setData({
      // 其中map为将传过来的时间戳变成正确的日期格式
      orders: res.data.message.orders.map(v => ({
        //toLocaleString：
        // 1.  let num=12345678;
        //     console.log(num.toLocaleString()); // 12,345,678
        // 2.  2021/10/12 下午7:39:06
        //     console.log(new Date().toLocaleString() 
        // 3.  2021/10/12 19:39:06
        //     console.log(new Date().toLocaleString('chinese',{hour12:false})) 
        ...v, create_time_cn: new Date(v.create_time * 1000).toLocaleString('chinese',{hour12:false})
      }))
    })
  }
})