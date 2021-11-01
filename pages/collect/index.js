// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[], 
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "电铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览足迹",
        isActive: false
      }
    ]
  },
  onShow(){
    const collect = wx.getStorageSync('collect')||[];
    // console.log(collect);
    this.setData({
      collect
    })
  },
  // 点击tab根据index修改样式
  handleTabsItemChange(e) {
    // console.log(e);
    const { index } = e.detail
    // console.log(index);

    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)

    this.setData({
      tabs
    })
  },
})