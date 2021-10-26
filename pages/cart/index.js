// pages/cart/index.js
Page({
  data: {
    address: {},
    cart: [],
    allCheck: false,
    totalPrice: 0,
    totalNum: 0,
  },

  onShow() {
    // 获取缓存中的地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || []
    // 全选按钮
    // const allCheck = cart.length? cart.every(v => v.checked):false  注：空数组调用every方法依旧返回true
    // 总价格 总数量
    // let totalPrice = 0
    // let totalNum = 0
    // let allCheck = true
    // // 因为遍历cart用到俩个循环，浪费性能，所以在这边给allCheck赋值
    // cart.forEach(v => {
    //   if (v.checked) {
    //     totalPrice += v.num * v.data.message.goods_price
    //     totalNum += v.num
    //   } else {
    //     allCheck = false
    //   }
    // });

    // // 判断数组是否为空
    // allCheck = cart.length != 0 ? allCheck : false

    // // 给data赋值
    // this.setData({
    //   address,
    //   cart,
    //   allCheck, 
    //   totalPrice,
    //   totalNum
    // })

    this.setData({
      address
    })

    // 调用封装的方法
    this.setCart(cart)
  },

  // 对底部栏数据进行封装
  setCart(cart) {
    // 重新给全选，总价格，总数量赋值
    let totalPrice = 0
    let totalNum = 0
    let allCheck = true

    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.data.message.goods_price
        totalNum += v.num
      } else {
        allCheck = false
      }
    });


    allCheck = cart.length != 0 ? allCheck : false

    this.setData({
      cart, totalPrice, totalNum, allCheck
    })

    wx.setStorageSync("cart", cart)

  },

  // 点击收货地址触发的点击事件
  handleChooseAddress() {
    // console.log("111");

    // 调用wx.chooseAddress，获取收货地址
    wx.chooseAddress({
      success: (result) => {
        // console.log(result); 
        wx.setStorageSync("address", result);
      },
    });
  },
  // 商品选中按钮逻辑
  handleItemChange(e) {
    // 1.获取被修改的商品ID
    const goods_id = e.target.dataset.id
    // console.log(goods_id);
    // 2.从缓存中获取购物车的数组
    let { cart } = this.data
    // console.log(cart);
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v => v.data.message.goods_id === goods_id)
    // 4.选中状态取反
    cart[index].checked = !cart[index].checked

    this.setCart(cart)

  },
  // 商品全选功能
  handleItemAllCheck() {
    // 1.获取data中的数据
    let { cart, allCheck } = this.data
    // 2.取反
    allCheck = !allCheck
    // 3.循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allCheck)
    // 4.把修改后的值放入缓存中
    this.setCart(cart)
  },

  // 点击按钮对商品数量进行增减
  handleItemNumChange(e) {
    // 1.获取对应的操作源数据
    const { operation, id } = e.currentTarget.dataset
    // console.log(operation,id);

    // 2.获得购物车数组
    let { cart } = this.data
    // 3.找到要修改的索引
    const index = cart.findIndex(v => v.data.message.goods_id === id)
    // 6.对商品要进行删除进行判断
    if (cart[index].num === 1 && operation === -1) {
      wx.showModal({
        title: '提示',
        content: '是否对商品进行删除',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            cart.splice(index, 1)
            this.setCart(cart)
          }
        }
      });
    } else {
      // 5.进行修改数量
      cart[index].num += operation
      // 6.设置回缓存的data中
      this.setCart(cart)
    }
  },
  // 点击支付进行逻辑判断和跳转
  handlePay() {
    const { address, totalNum } = this.data
    // 1.如果收货地址不存在，则提示用户输入收货地址
    if (!address) {
      wx.showToast({
        title: '你还没有选择收货地址',
        icon: 'none',
      });
      return
    }
    // 2.如果商品没有加入购物车，则提示用户选择商品
    if (totalNum === 0) {
      wx.showToast({
        title: '你还没有选择商品',
        icon: 'none',
      });
      return
    }
    // 3.如果以上逻辑通过，则跳转到支付界面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }

})