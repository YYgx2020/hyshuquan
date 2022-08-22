// pages/my/my.js
import {getUserProfile} from '../../utils/auth';
// import {test, myFun} from '../../utils/test';
const app = new getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    funList: [
      {
        id: 0,
        icon: 'icon-daifukuan',
        text: '待付款',
        toView: 'daifukuan'
      },
      {
        id: 1,
        icon: 'icon-daifahuo',
        text: '待发货',
        toView: 'daifahuo'
      },
      {
        id: 2,
        icon: 'icon-shinshopdaishouhuo',
        text: '待收货',
        toView: 'daishouhuo'
      },
      {
        id: 3,
        icon: 'icon-daipingjia',
        text: '待评价',
        toView: 'daipingjia'
      },
      {
        id: 4,
        icon: 'icon-shouhoutuikuan',
        text: '退款/售后',
        toView: 'refund'
      },
    ],
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '我的',
    })
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },

  // 授权登录事件
  async login() {
    try {
      let p = await getUserProfile()
      console.log(p);
      if (p) {
        this.setData({
          userInfo: app.globalData.userInfo
        })
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(getUserProfile());
    // console.log(123);
  },

  // 跳转到所有订单页面
  toAllOrderPage() {
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },

  toCarPage() {
    wx.switchTab({
      url: '/pages/car/car',
    })
  },

  // 跳转到收货地址页面
  toAddressPage() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  // 跳转到收藏列表页面
  toCollectionPage() {
    wx.navigateTo({
      url: '/pages/collection/colletion',
    })
  },

  // 退出登录
  layoutEvent() {
    wx.showModal({
      title: '提示',
      content: '确认退出吗？',
      success: res => {
        if (res.confirm) {
          app.globalData.userInfo = null
          this.setData({
            userInfo: null,
          })
        }
      }
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