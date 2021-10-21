// 使用Promise简化异步请求的操作
export const request =(params) => {
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,
      success:(res)=>{
        resolve(res)
      },
      fail:(rej)=>{
        reject(rej)
      }
    })
  })
}