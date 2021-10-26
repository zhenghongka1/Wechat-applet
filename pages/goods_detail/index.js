import { request } from "../../request/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetailList: [] 
  },
  // 商品的对象
  Goods_Info: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    // console.log(options.goods_id);
    const { goods_id } = options

    this.getGoodsDetail(goods_id)
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsDetailList = await request({ url: "/goods/detail", data: { goods_id } })
    this.Goods_Info = goodsDetailList
    // console.log(goodsDetailList);
    this.setData({
      goodsDetailList: {
        goods_name: goodsDetailList.data.message.goods_name,
        goods_price: goodsDetailList.data.message.goods_price,
        // 因为iphone部分手机不识别webp的图片格式，最好是找后台修改，不然就他喵的自己临时改（不推荐）
        goods_introduce: goodsDetailList.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsDetailList.data.message.pics
      }
    })
  }, 
  // 点击轮播图放大预览
  handlePrevewImage(e) {
    // console.log("1111");
    // console.log(e);
    console.log(this.Goods_Info);
    const urls = this.Goods_Info.data.message.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });

  },
  // 点击加入购物车
  handleCartAdd() { 
    // 1.获取缓存中的购物车 数组
    let cartData = wx.getStorageSync("cart") || []; 
    // 2.判断商品对象是否存在于数组中
    let index = cartData.findIndex(v => v.data.message.goods_id === this.Goods_Info.data.message.goods_id)
    // console.log(this.Goods_Info);
    if (index === -1) {
      // 3.不在购物车里，第一次添加
      this.Goods_Info.num = 1
      this.Goods_Info.checked = true
      cartData.push(this.Goods_Info)
    } else {
      // 4.已经存在购物车数据，num++
      cartData[index].num++
 
    }
    // 5.把购物车重新添加到缓存中
    wx.setStorageSync("cart", cartData);
    // 6.弹框提示
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      // mask这个值可以防止用户狂点，等1.5秒之后才可以点击
      mask: true
    })

  }

})
