import { request } from '../../request/request'
Page({

  data: {
    // 左侧导航栏数据
    leftMenuList: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧商品菜单数据
    rightMenuList: [],
    // 右侧内容的顶部距离
    scrollTop: 0
  },
  // 接口返回的数据
  cateData: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  1.先判断本地存储中有误旧的数据
    //  2.如果没有旧数据，直接发送
    //  3.有旧数据且旧的数据没有过期，就使用本地存储中的旧数据即可

    // 第一步：获取本地存储中的数据
    const cateData = wx.getStorageSync('cates');
    // 第二步：判断
    if (!cateData) {
      // 不存在，直接发送请求
      this.getCate()
    } else {
      // 有旧数据  定义过期时间 10s 改成 5分钟
      if (Date.now() - cateData.time > 1000 * 10) {
        // 重新发送请求
        this.getCate()
      } else {
        // 可以使用旧的数据
        // console.log("使用旧数据");
        this.cateData = cateData.data
        // 左侧菜单数据
        let leftMenuList = this.cateData.map(v => v.cat_name)
        // 右侧菜单数据
        let rightMenuList = this.cateData[0].children;
        this.setData({
          leftMenuList,
          rightMenuList
        })
      }
    }

    // this.getCate();
  },
  // 获取分类页面的数据
  async getCate() {
    // request({
    //   url: '/categories'
    // })
    //   .then(res => {
    //     // console.log(res);
    //     this.cateData = res.data.message;

    //     //把接口的数据存储到本地中
    //     wx.setStorageSync("cates",{time:Date.now(),data:this.cateData});

    //     // 左侧菜单数据
    //     let leftMenuList = this.cateData.map(v => v.cat_name)

    //     // 右侧菜单数据
    //     let rightMenuList = this.cateData[0].children;

    //     this.setData({
    //       leftMenuList,
    //       rightMenuList
    //     })
    //   })

    const res = await request({ url: '/categories' })

    this.cateData = res.data.message;

    // 把接口的数据存储到本地中
    wx.setStorageSync("cates", { time: Date.now(), data: this.cateData });

    // 左侧菜单数据
    let leftMenuList = this.cateData.map(v => v.cat_name)

    // 右侧菜单数据
    let rightMenuList = this.cateData[0].children;

    this.setData({
      leftMenuList,
      rightMenuList
    })

  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // console.log(e);

    // 1.获取被点击的标题上的索引
    // 2.给data中的currentIndex赋值
    // 3.根据不同的索引渲染右侧的商品
    const { index } = e.currentTarget.dataset;

    let rightMenuList = this.cateData[index].children;

    this.setData({
      currentIndex: index,
      rightMenuList,
      scrollTop: 0
    })
  }
})