
// pages/charge/charge.js
const app = new getApp()

const reg1 = /^[1-9]+([0-9]{0,3})$/
const reg2 = /^(0|([1-9]\d*))(\.\d{1,2})?$/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取用户信息
    let userInfo = app.globalData.userInfo
    this.setData({
      userInfo,
    })
  },

  // 查看交易记录
  toDealPage(e) {
    wx.navigateTo({
      url: '/pages/deal/deal',
    })
  },

  // 充值弹窗
  chargeEvent() {
    let {userInfo} = this.data;
    wx.showModal({
      // title: '充值',
      title: '请输入您要充值的金额, 单次最高可充值1000元',
      editable: true,
      placeholderText: '请输入1-1000之间的整数',
      success: res => {
        if (res.confirm) {
          console.log(res);
          if (!res.content.trim()) {
            return
          }
          if (reg1.test(res.content)) {
            let num = parseInt(res.content)
            console.log('num: ', num);
            if (num > 1000) {
              wx.showToast({
                title: '请输入正确的金额',
                icon: 'none',
                mask: true
              })
            } else {
              // 更新数据
              console.log('更新数据');
              userInfo.money = num + userInfo.money;
              this.updateUserInfo(userInfo, '充值');
            }
          } else {
            wx.showToast({
              title: '请输入正确的金额',
              icon: 'none',
              mask: true
            })
            // return
          }
          // 更新用户的金额信息
        }
        if (res.cancel) {
          // console.log('取消输入');
          return
        }
      }
    })
  },

  // 提现弹窗
  cashEvent() {
    let {userInfo} = this.data;
    wx.showModal({
      // title: '充值',
      title: '请输入您要提现的金额,仅支持提现到小数点后两位',
      editable: true,
      placeholderText: '请输入金额',
      success: res => {
        if (res.confirm) {
          console.log(res);
          if (!res.content.trim()) {
            return
          }
          if (reg2.test(res.content)) {
            let num = parseFloat(res.content)
            console.log('num: ', num);
            
            if (num > parseFloat(userInfo.money)) {
              wx.showToast({
                title: '提现金额大于余额',
                icon: 'none',
                mask: true
              })
            } else {
              // 更新数据
              console.log('更新数据');
              userInfo.money = userInfo.money - num;
              this.updateUserInfo(userInfo, '提现');
            }
          } else {
            wx.showToast({
              title: '请输入正确的金额',
              icon: 'none',
              mask: true
            })
            // return
          }
          // 更新用户的金额信息
        }
        if (res.cancel) {
          return
        }
      }
    })
  },

  // 更新函数
  updateUserInfo(userInfo, type) {
    wx.showLoading({
      title: `正在${type}中`,
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: userInfo,
    }).then(res => {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: `${type}成功`,
        icon: 'success',
        mask: true
      })
      app.globalData.userInfo = userInfo;
      this.setData({
        userInfo,
      })
    }).catch(err => {
      console.log(err);
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: `${type}失败`,
        icon: 'error',
        mask: true
      })
    })
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