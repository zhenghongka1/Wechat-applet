import { request } from "../../request/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetailList: [],
    // 商品是否收藏
    isCollect: false,
  },
  // 商品的对象
  Goods_Info: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    var curPages = getCurrentPages();
    let { options } = curPages[curPages.length - 1]
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

    // 1.获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync('collect') || []
    // 2.判断当前商品是否被收藏
    let isCollect = collect.some(v => v.data.message.goods_id === this.Goods_Info.data.message.goods_id)


    this.setData({
      goodsDetailList: {
        goods_name: goodsDetailList.data.message.goods_name,
        goods_price: goodsDetailList.data.message.goods_price,
        // 因为iphone部分手机不识别webp的图片格式，最好是找后台修改，不然就他喵的自己临时改（不推荐）
        goods_introduce: goodsDetailList.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsDetailList.data.message.pics
      },
      // 商品是否收藏
      isCollect
    })
  },
  // 点击轮播图放大预览
  handlePrevewImage(e) {
    // console.log("1111");
    // console.log(e);
    // console.log(this.Goods_Info);
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

  },
  // 点击商品收藏按钮进行收藏
  handleCollect() {
    let isCollect = false;
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2.判断该商品是否被收藏过
    let index = collect.findIndex(v => v.data.message.goods_id === this.Goods_Info.data.message.goods_id);
    // console.log(index);
    // 3.当index !== -1 表示 已经被收藏过 
    if (index !== -1) {
      // 能找到，已经被收藏过的，那么再次点击则取消收藏
      collect.splice(index, 1)
      isCollect = false
      wx.showToast({
        title: '取消收藏',
        icon: 'true',
      });
    } else {
      // 没被收藏过
      collect.push(this.Goods_Info)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'true',
      });
    }
    // 4.把数组存入到缓存中
    wx.setStorageSync('collect', collect);
    // 修改data中的属性
    this.setData({
      isCollect
    })
  }
})
