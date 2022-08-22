// 获取用户信息接口
const app = getApp()

export const getUserProfile = async () => {
  return new Promise((resolve, reject) => {
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
          app.globalData.userInfo = {
            userName: userInfo.nickName,
            userAvatar: userInfo.avatarUrl,
            openid: app.globalData.openid,
            userPhone: '',
            address: '',
            shoppingCartID: '',
            collections: [],
          }
          resolve(true)
        } else {
          // 直接获取用户信息
          app.globalData.userInfo = p2.data[0]
          resolve(true)
        }
      } catch (error) {
        resolve(error)
      }
    })
  })
}
