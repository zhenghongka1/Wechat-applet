// pages/search/index.js
import { request } from '../../request/request'
Page({
  data: {
    goods: [],
    // 取消按钮是否显示
    isFocus: false,
    // 文本框重置按钮
    value: ''
  },
  // 防抖的定时器
  Time: 1,
  //1. 输入框输入值后进行改变就会触发事件
  handleInput(e) {
    // console.log(e);
    const { value } = e.detail
    // console.log(value);

    // 2.检验合法性 trim为去除俩边的空格
    if (!value.trim()) {
      // 隐藏取消按钮
      this.setData({
        goods: [],
        isFocus: false
      })
      // 当对搜索框进行删除的时候，可能会触发下面的定时器进而发送数据，所以在这里清空定时器
      clearTimeout(this.Time)
      // 值不合法
      return
    }
    // 显示取消按钮
    this.setData({
      isFocus: true
    })
    // 3.准备发送请求获取数据（准备防抖技术）
    clearTimeout(this.Time)
    this.Time = setTimeout(() => {
      this.qsearch(value)
    }, 1000);

  },
  // 发送请求获取搜索建议的数据
  async qsearch(query) {
    const res = await request({ url: '/goods/qsearch', data: { query } })
    const goods = res.data.message
    // console.log(res);
    this.setData({
      goods
    })
  },
  handleCancel() {
    this.setData({
      value: '',
      isFocus: false,
      goods: []
    })
  }
})