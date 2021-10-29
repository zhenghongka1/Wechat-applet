// 使用Promise简化异步请求的操作
let ajaxTimes = 0

export const request = params => {
// 判断请求参数的url中是否携带my这个字段，如果有则自动带有请求头header
let header = {...params.header} //这里可能会往往请求头再添加一些参数，所以要用数组拼接
if(params.url.indexOf('/my/') !== -1){
  header['Authorization'] = wx.getStorageSync('token');
}

  ajaxTimes++
  // 显示加载中效果
  wx.showLoading({
    title: "加载中",
    mask: true,
  });

  // 定义公共的url
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header:header,
      url: baseUrl + params.url, 
      success: (res) => {
        resolve(res)
      },
      fail: (rej) => {
        reject(rej)
      },
      complete: () => {
        ajaxTimes--
        if (ajaxTimes === 0) {
          // 关闭加载效果
          wx.hideLoading();
        }
      }
    })
  })
}