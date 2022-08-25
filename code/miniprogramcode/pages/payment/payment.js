// pages/payment/payment.js
const app = new getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultAddress: null,
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    let {
      _id,
      entry
    } = options;
    let {
      userInfo
    } = app.globalData
    let defaultAddress = null;
    console.log(userInfo);
    if (userInfo.address.length !== 0) {
      defaultAddress = userInfo.address[0]
      defaultAddress.phone = defaultAddress.phone.substring(0, 3) + '****' + defaultAddress.phone.substring(7, 11)
    }
    this.setData({
      _id,
      userInfo,
      entry,
      defaultAddress,
    })
    /* 
      分两个入口：
      detail: 图书详情页进来的，
        - 获取当前图书的封面、书名、价格
      car: 购物车页面进来的
    */
    if (entry == 'detail') {
      this.getBookInfo(_id)
    }
  },

  // 获取图书的部分数据
  async getBookInfo(_id) {
    console.log(_id);
    wx.showLoading({
      title: '',
      mask: true,
    })
    try {
      let p = await wx.cloud.database().collection('books').doc(_id).get()
      console.log(p);
      wx.hideLoading({
        success: (res) => {},
      })
      let {
        cover,
        bookName: name,
        price
      } = p.data
      let book = {
        cover,
        name,
        price,
        num: 1,
      }
      let totalPrice = price
      this.setData({
        book,
        totalPrice,
      })
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '数据加载失败',
        icon: 'error',
        mask: true,
      })
    }
  },

  // 新增地址
  toAddressPage() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  // 减号事件
  subtractEvent(e) {
    console.log('减号');
    let {
      book
    } = this.data
    if (book.num === 1) {
      return
    } else {
      book.num -= 1
      let totalPrice = (parseFloat(book.price) * book.num).toFixed(2);
      this.setData({
        book,
        totalPrice,
      })
    }
  },

  // 加号事件
  addEvent(e) {
    console.log('加号');
    let {
      book
    } = this.data
    book.num += 1
    let totalPrice = (parseFloat(book.price) * book.num).toFixed(2);
    this.setData({
      book,
      totalPrice,
    })
  },

  // 跳转到添加收货地址页面（用户信息中没有保存收货地址时）
  toAddressPage(e) {
    console.log(e);
    let {entry} = e.currentTarget.dataset
    if (entry) {
      wx.navigateTo({
        url: '/pages/address/address?entry=' + entry,
      })
    } else {
      wx.navigateTo({
        url: '/pages/address/address',
      })
    }
  },

  // 生成订单
  async submitOrder() {
    /* 
      代码逻辑：
      1. 先查看是否有无当前订单，有则更新，没有则生成，然后跳转至确认付款页面
    */
    let {
      userInfo,
      entry,
      book,
      _id,
      totalPrice
    } = this.data;
    console.log("_id: ", _id);
    if (userInfo.address.length === 0) {
      await wx.showModal({
        title: '提示',
        content: '请选择一个收货地址',
      })
      return
    }
    let goodsInfo = []
    if (entry === 'detail') {
      goodsInfo.push({
        name: book.name,
        cover: book.cover,
        price: book.price,
        num: book.num,
        bookID: _id
      })
    }
    console.log("goodsInfo: ", goodsInfo);
    //  直接生成，不给更新
    wx.showLoading({
      title: '订单生成中',
      mask: true,
    })
    let createTime = new Date().getTime();
    wx.cloud.database().collection('orders').add({
        data: {
          createTime,
          orderID: 'D' + createTime,
          goodsInfo,
          totalPrice,
          openid: userInfo.openid,
          status: 0,
          address: userInfo.address[0],
        }
      }).then(res => {
        console.log(res);
        wx.hideLoading()
        wx.setStorageSync('totalPrice', totalPrice)
        wx.setStorageSync('createTime', createTime)
        // wx.setStorageSync('currentBookid', _id)
        wx.navigateTo({
          url: '/pages/confirmPay/confirmPay',
        })
      })
      .catch(err => {
        console.log(err);
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '订单生成失败',
          icon: 'error',
          mask: true,
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
    let {
      userInfo
    } = app.globalData
    let defaultAddress = null;
    console.log(userInfo);

    //  先看存储中有没有保存用户选择的收货地址，
    // 如果有，则从存储中拿，如果没有则从用户信息中拿第一个默认的地址

    defaultAddress = wx.getStorageSync('defaultAddress')
    if (defaultAddress) {
      let index = wx.getStorageSync('curAddressIndex')
      this.setData({
        userInfo,
        defaultAddress,
        index: parseInt(index),
      })
      return
    }

    if (userInfo.address.length !== 0) {
      defaultAddress = userInfo.address[0]
      defaultAddress.phone = defaultAddress.phone.substring(0, 3) + '****' + defaultAddress.phone.substring(7, 11)
    }
    this.setData({
      userInfo,
      defaultAddress,
      index: 0,
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