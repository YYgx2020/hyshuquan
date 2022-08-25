// pages/confirmPay/confirmPay.js
const app = new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      totalPrice: wx.getStorageSync('totalPrice'),
      createTime: wx.getStorageSync('createTime'),
    })
  },

  async confirmBtn() {
    let {totalPrice, createTime} = this.data;
    let {userInfo} = app.globalData
    if (userInfo.money < parseFloat(totalPrice)) {
      wx.showModal({
        title: '提示',
        content: '您的购书币余额不足，无法购买',
        cancelText: '确定',
        confirmText: '去充值',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/charge/charge',
            })
          } 
          if (res.cancel) {
            return
          }
        }
      })
    } else {
      // 扣除用户的余额，然后更新用户数据
      /* 
        需要更新的数据/表
        - 用户信息表（购书币余额）
        - 订单信息表（订单状态 -> 1）
        - 当前购买图书的销量（sales + 1）
      */
      wx.showLoading({
        title: '订单支付中',
        mask: true,
      })
      try {
        // 更新用户信息表（购书币余额）
        let money = parseFloat((userInfo.money - parseFloat(totalPrice)).toFixed(2));
        console.log('用户余额：', money);
        userInfo.money = money
        let p1 = await wx.cloud.callFunction({
          name: 'updateUserInfo',
          data: userInfo,
        })
        app.globalData.userInfo = userInfo
        console.log('p1: ', p1);
        // 更新订单信息表（订单状态 -> 1）
        let p2 = await wx.cloud.database().collection('orders').where({
          openid: userInfo.openid,
          createTime,
        }).update({
          data: {
            status: 1,
          }
        })
        console.log('p2: ', p2);
        
        // 生成订单信息
        let p3 = await wx.cloud.database().collection('orders').where({
          openid: userInfo.openid,
          createTime,
        }).get()
        console.log('p3: ', p3);
        let {orderID, goodsInfo} = p3.data[0];
        let p4 = await wx.cloud.database().collection('deals').add({
          data: {
            goodsInfo,
            orderID,
            createTime: new Date().getTime(),
            payMoney: parseFloat(totalPrice),
            remainMoney: money,
            dealID: 'J' + new Date().getTime(),
          }
        })
        console.log('p4:', p4);

        // 更新图书信息表
        // wait to code...
        wx.switchTab({
          url: '/pages/index/index',
        })
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          mask: true,
        })
      } catch (error) {
        console.log('支付失败：', error);
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '支付失败',
          icon: 'error',
          mask: true,
        })
      }
      
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      totalPrice: wx.getStorageSync('totalPrice'),
      createTime: wx.getStorageSync('createTime'),
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})