// 获取用户信息接口
const app = getApp()

export const getUserProfile = async () => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '正在登录中',
      mask: true
    })
    setTimeout(async () => {
      console.log(1);
      try {
        let p1 = await wx.getUserProfile({
          desc: '获取用户昵称和头像',
        })
        let userInfo = p1.userInfo;
        let p2 = await wx.cloud.database().collection('users')
          .where({
            openid: app.globalData.openid,
          })
          .get()

        let p3 = null
        if (p2.data.length === 0) {
          // 创建用户
          p3 = await wx.cloud.callFunction({
            name: 'addUser',
            data: {
              userName: userInfo.nickName,
              userAvatar: userInfo.avatarUrl,
              openid: app.globalData.openid
            }
          })
          console.log(p3);
          // 全局保存用户信息
          app.globalData.userInfo = {
            userName: userInfo.nickName,
            userAvatar: userInfo.avatarUrl,
            openid: app.globalData.openid,
            address: '',
            shoppingCartID: '',
            collections: [],
            money: 0,
          }
          wx.hideLoading({
            success: (res) => {},
          })
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
          resolve(true)
        } else {
          // 直接获取用户信息
          app.globalData.userInfo = p2.data[0]
          wx.hideLoading({
            success: (res) => {},
          })
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
          resolve(true)
        }
      } catch (error) {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '登录失败',
          icon: 'error'
        })
        resolve(error)
      }
    })
  })
}
