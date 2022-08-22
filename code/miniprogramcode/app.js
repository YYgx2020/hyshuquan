// app.js
App({
  onLaunch() {
    // 使用云函数功能记得在app.js中初始化
    wx.cloud.init({
      env: 'shuquan-5g315jeg71bca5e1',
    })
    wx.setBackgroundFetchToken({
      token: 'shuquan_token'
    })
    // wx.onBackgroundFetchData(() => {
    //   console.log(res);
    //   console.log(res.fetchedData) // 缓存数据
    //   console.log(res.timeStamp) // 客户端拿到缓存数据的时间戳
    // })
    wx.getBackgroundFetchData({
      fetchType: 'pre',
      success(res) {
        // console.log(res);
        const fd = JSON.parse(res.fetchedData)
        // console.log(fd) // 缓存数据
        // 传递给首页
        // this.globalData.bookAllData = fd;
        wx.setStorageSync('allBookList', fd)
        // console.log(res.timeStamp) // 客户端拿到缓存数据的时间戳
        // console.log(res.path) // 页面路径
        // console.log(res.query) // query 参数
        // console.log(res.scene) // 场景值
      }
    })
    wx.cloud.callFunction({
      name: 'getOpenID'
    })
    .then(res => {
      console.log(res);
      this.globalData.openid = res.result.openid
    })
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
  },
  globalData: {
    userInfo: null
  }
})
