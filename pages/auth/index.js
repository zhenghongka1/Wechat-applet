import { request } from '../../request/request'
import { login } from '../../utils/async'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 获取用户信息
  async handleGetUserInfo(e) {

    // console.log(e);

    // 1.获取用户信息
    // const { encryptedData, rawData, iv, signature } = e.detail;
    // // 2.获得小程序登录后的code
    // const {code} = await login()
    // // console.log(code);
    // const loginParams = { encryptedData, rawData, iv, signature,code}
    // const res = await request({url:"/users/wxlogin",data:loginParams,methods:"post"})
    // console.log(res); 

    // 因为不是企业账号获取不到后台的token，这里自己定义一个token值
    try {
      const { encryptedData, rawData, iv, signature } = e.detail
      const code = await login()
      //发送获取token请求
      const params = { encryptedData, rawData, iv, signature, code }
      //const { token } = await request({ url: "/users/wxlogin", data: params, method: "post" });
      let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
      wx.setStorageSync('token', token)
      //wx.setStorageSync('token', token)
      wx.navigateBack({
        delta: 1
      });
    } catch (err) {
      console.log(err);
    }
  }
})