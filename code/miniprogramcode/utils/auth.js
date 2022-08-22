// 获取用户信息接口
const app = getApp()
export async function getUserProfile(e) {
  
  // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  await wx.getUserProfile({
    desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      console.log(res);
      let userInfo = res.userInfo;
      // 通过 openid 去查询数据库是否有当前用户
      wx.cloud.database().collection('users')
      .where({
        openid: app.globalData.openid,
      })
      .get()
      .then(res => {
        console.log(res.data);
        if (res.data.length === 0) {
          // 创建用户
          wx.cloud.callFunction({
            name: 'addUser',
            data: {
              userName: userInfo.nickName,
              userAvatar: userInfo.avatarUrl,
              openid: app.globalData.openid
            }
          })
          .then(res2 => {
            console.log('res2: ', res2);
            app.globalData.userInfo = {
              userName: userInfo.nickName,
              userAvatar: userInfo.avatarUrl,
              openid: app.globalData.openid,
              userPhone: '',
              address: '',
              shoppingCartID: '',
              collections: [],
            }
            return true;
          })
          .catch(err2 => {
            console.log('用户创建失败', err2);
            return false
          })
        } else {
          app.globalData.userInfo = res.data[0]
          return true
        }
      })
      .catch(err => {
        console.log(err);
        return false
      })
      // openid = 
      // this.setData({
      //   userInfo: res.userInfo,
      //   hasUserInfo: true
      // })
    },
    fail: () => {
      console.log('失败');
      return false
    }

  })
  // console.log('2');
}