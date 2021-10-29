// pages/cart/index.js
import { requestPayment, showToast } from "../../utils/async";
import { request } from '../../request/request'

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },

  onShow() {
    // 1.1获取缓存中的地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || []

    // 1.2点击支付按钮，显示要支付的商品列表为check为true的商品
    cart = cart.filter(v => v.checked)
    // 总价格，总数量
    let totalPrice = 0
    let totalNum = 0

    cart.forEach(v => {
      totalPrice += v.num * v.data.message.goods_price
      totalNum += v.num
    });

    this.setData({
      cart, totalPrice, totalNum, address
    })
  },
  // 2.点击支付逻辑
  async handlePay() {
    try {
      // 2.1判断缓存中是否有token
      const token = wx.getStorageSync("token")

      //2.2 判断缓存中的token是否存在，不存在则跳转到auth界面
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return
      }
      // 3.创建订单

      // 3.1准备 请求头参数
      // const header = { Authorization: token }

      // 3.2准备 请求参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.data.message.goods_id,
        goods_number: v.num,
        goods_price: v.data.message.goods_price
      }))
      const oderParams = { order_price, consignee_addr, goods };

      //3.3 发送请求 创建订单，获取订单号参数
      const res0 = await request({ url: "/my/orders/create", method: "POST", data: oderParams });
      // console.log(result);
      const { order_number } = res0.data.message;
      // console.log(order_number);

      // 3.4 发起预支付的接口
      const res1 = await request({ url: '/my/orders/req_unifiedorder', method: "POST", data: { order_number } })
      // console.log(res1);
      const { pay } = res1.data.message
      // console.log(pay);
      // 3.5 发起微信支付请求（显示二维码）
      await requestPayment(pay)
      
      //3.6 查询后台订单状态
      const res2 = await request({ url: '/my/orders/chkOrder', method: "POST", data: { order_number } })

      //3.7 支付成功后，手动删除购物车列表的数据（注意要删除的是选中的已经支付的商品，保留未被选中的商品）
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart);

      // 3.8支付成功，跳转到order
      await showToast('支付成功')
      wx.navigateTo({
        url: '/pages/order/index'
      });

    } catch (error) {
      // console.log(error);
      await showToast('支付失败')
    }

  }
})