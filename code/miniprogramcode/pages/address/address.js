// pages/address/address.js
const app = new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    address: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {entry} = options;
    console.log(app.globalData.userInfo);
    let {address} = JSON.parse(JSON.stringify(app.globalData.userInfo))
    console.log(app.globalData.userInfo);
    address = address.map(item => {
      item.phone = item.phone.substring(0, 3) + '****' + item.phone.substring(7, 11)
      return item
    })
    this.setData({
      address,
      entry,
    })
  },

  // 选择收货地址
  chooseAddress(e) {
    console.log(e);
    let {entry} = this.data;
    console.log('112');
    
    let {address} = JSON.parse(JSON.stringify(app.globalData.userInfo))
    let {index} = e.currentTarget.dataset
    if (entry) {
      console.log(address[index]);
      console.log(index);
      wx.setStorageSync('defaultAddress', address[index])
      wx.setStorageSync('curAddressIndex', index)
      // 返回上一个页面
      wx.navigateBack({
        delta: 1,
      })
    } else {
      return
    }
  },

  editAddress(e) {
    let {index} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/newAddress/newAddress?index=' + index,
    })
  },

  // 新增用户收货地址
  addressEvent() {
    wx.navigateTo({
      url: '/pages/newAddress/newAddress',
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
    console.log('onshow');
    console.log(app.globalData.userInfo);
    let {address} = JSON.parse(JSON.stringify(app.globalData.userInfo))
    address = address.map(item => {
      item.phone = item.phone.substring(0, 3) + '****' + item.phone.substring(7, 11)
      return item
    })
    this.setData({
      address,
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