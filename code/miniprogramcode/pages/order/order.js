// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [
      {
        id: 'quanbu',
        text: '全部',
      },
      {
        id: 'daifukuan',
        text: '待付款',
      },
      {
        id: 'daifahuo',
        text: '待发货',
      },
      {
        id: 'daishouhuo',
        text: '待收货',
      },
      {
        id: 'daipingjia',
        text: '待评价',
      },
    ],
    orderData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    wx.setNavigationBarTitle({
      title: '所有订单',
    })
    this.setData({
      view: options.view
    })
  },

  // 跳转到搜索订单页面
  searchEvent() {
    console.log('跳转到搜索订单页面');
    wx.navigateTo({
      url: '/pages/orderSearch/orderSearch',
    })
  },

  // 导航栏点击事件
  changeNav(e) {
    // console.log(e);
    let view = e.currentTarget.id;
    let index = e.currentTarget.dataset
    this.setData({
      view,
      current: index,
    })
  },

  swiperChange(e) {

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