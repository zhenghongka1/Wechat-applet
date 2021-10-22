import { request } from "../../request/request";

Page({

  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },

  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,

  onLoad: function (options) {
    // console.log(options);
    this.QueryParams.cid = options.cid

    this.getGoodsList()
  },

  // 获取商品列表的数据
    async getGoodsList(){
      const res = await request({url:"/goods/search",data:this.QueryParams});
      // 获得总条数
      const {total} = res.data.message
      // 计算总页数 
      this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
      // console.log(total);
      // console.log(res); 
      // console.log(this.QueryParams.pagenum);
      this.setData({
        // 这里要使用数组的拼接，因为如果不拼接，请求回来新的10条数据，会把原来的数据
        // 给覆盖掉，只剩下后面的10条数据
        goodsList:[...this.data.goodsList,...res.data.message.goods]
      })

    // 数据回来后关闭下拉窗口
    wx.stopPullDownRefresh()
    }, 

  // 标题点击事件，从子组件传递过来
  handleTabsItemChange(e){
    // console.log(e);
    const {index} = e.detail

    // 修改源数据
    let {tabs} = this.data
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false)

    this.setData({
      tabs
    })
  },

  //页面上滑，滚动条触底加载数据
  // 监听滚动底部的生命周期函数
  onReachBottom: function () {
    // console.log("页面触底");
    // 判断有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      // 没有下一页数据,一个会自己过一会消失的提示框
      wx.showToast({title: '没有数据了!!'});
    }else{
      //还有下一页数据
       this.QueryParams.pagenum++;
       this.getGoodsList()
       }
  },

  // 下拉刷新事件
  onPullDownRefresh(){
    // console.log("1111");
    this.setData({
      // 1.重置数组数据
      goodsList:[]
    })

    // 2.重置页码
    this.QueryParams.pagenum = 1

    // 3.再次发送请求
    this.getGoodsList()
  }
})