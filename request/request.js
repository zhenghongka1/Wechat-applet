// 使用Promise简化异步请求的操作
let ajaxTimes = 0
export const request =(params) => {
  ajaxTimes++
  // 显示加载中效果
  wx.showLoading({
    title:"加载中" ,
    mask: true,
  });

  // 定义公共的url
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,
      url:baseUrl+params.url,
      success:(res)=>{
        resolve(res)
      },
      fail:(rej)=>{ 
        reject(rej)
      },
      complete:()=>{
        ajaxTimes--
        if(ajaxTimes===0){
          // 关闭加载效果
        wx.hideLoading();
        }
      }
    })
  })
}