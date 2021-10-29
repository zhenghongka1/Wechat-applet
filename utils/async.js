//结算吐司提醒
export const showToast = (title) => {
    return new Promise((reslove, reject) => {
        wx.showToast({
            title: title,
            icon: "none",
            duration: 2000
        })
    })
};

export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 10000,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

//微信支付请求
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

