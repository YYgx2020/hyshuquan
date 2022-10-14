// pages/orderDetail/orderDetail.js
import {
  formatTime
} from "../../utils/util";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    orderInfo: null,
    phone: '',
    addressDetail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    let {
      orderId,
      isAdmin,
    } = options;
    if (isAdmin === '1') {
      this.setData({
        isAdmin: true,
      })
    }
    this.getOrderInfo(orderId);
  },

  // 获取订单信息
  getOrderInfo(id) {
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let {
      isAdmin
    } = this.data;
    wx.cloud.database().collection('orders')
      .where({
        _id: id,
      })
      .get()
      .then(res => {
        wx.hideLoading({
          success: (res) => {},
        })
        console.log(res);
        let phone = res.data[0].address.phone.substring(0, 3) + '****' + res.data[0].address.phone.substring(7, 11)
        let addressDetail = res.data[0].address.region[0] + '，' + res.data[0].address.region[1] + '，' + res.data[0].address.region[2] + '，' + res.data[0].address.detail;
        let createTime = formatTime(res.data[0].createTime)
        if (isAdmin) {
          phone = res.data[0].address.phone
        }
        this.setData({
          orderInfo: res.data[0],
          phone,
          addressDetail,
          createTime
        })
      })
      .catch(err => {
        wx.hideLoading({
          success: (res) => {},
        })
        console.log(err);
        wx.showModal({
          title: '提示',
          content: '数据加载失败，请退出重试',
        })
      })
  },

  // 修改收货地址
  addressEdit() {
    console.log('修改收货地址');
    wx.navigateTo({
      url: '/pages/address/address?entry=orderDetail',
    })
  },

  // 取消订单
  /* 
    先拿到当前订单的 id 和 openid，然后去更新数据库中的数据，最后再刷新页面重新获取数据
  */
 cancelOrderEvent(e) {
  console.log(e);
  let {orderInfo} = this.data;
  let {_id, openid} = orderInfo;
  wx.showLoading({
    title: '订单取消中',
    mask: true,
  })
  wx.cloud.database().collection('orders')
  .where({
    openid,
    _id
  })
  .update({
    data: {
      status: -1,
    }
  })
  .then(res => {
    wx.hideLoading({
      success: (res) => {},
    })
    // 刷新页面重新获取数据
    // this.getOrderList('q');
    // 返回上一个页面
    wx.navigateBack({
      delta: 1,
    })
  })
  .catch(err => {
    wx.hideLoading({
      success: (res) => {},
    })
    wx.showToast({
      title: '取消订单失败',
      icon: 'error',
      mask: true,
    })
    console.log(err);
  })
},

// 删除订单
deteleEvent(e) {
  // 获取订单id
  let {orderInfo} = this.data;
  let {_id, openid} = orderInfo;

  wx.showModal({
    title: '提示',
    content: '确定删除当前订单吗？',
    success: res => {
      if (res.confirm) {
        console.log('删除订单');
        wx.showLoading({
          title: '订单删除中',
          mask: true,
        })
        wx.cloud.database().collection('orders')
          .where({
            _id,
            openid
          })
          .remove()
          .then(res => {
            console.log(res);
            wx.hideLoading({
              success: (res) => {},
            })
            // this.getOrderList('q')
            wx.navigateBack({
              delta: 1,
            })
          })
          .catch(err => {
            wx.showToast({
              title: '订单删除失败',
              icon: 'error',
            })
            wx.hideLoading({
              success: (res) => {},
            })
          })
      }
      if (res.cancel) {
        console.log('取消订单');
      }
    }
  })
},

  // 立即支付
  /* 
    支付逻辑：
    跳转到订单支付页面
  */
  payEvent(e) {
    console.log(e);
    let {
      orderInfo
    } = this.data;
    let {
      createTime,
      totalPrice
    } = orderInfo;
    wx.setStorageSync('totalPrice', totalPrice);
    wx.setStorageSync('createTime', createTime);
    wx.navigateTo({
      url: '/pages/confirmPay/confirmPay',
    })
  },

  // 商家订单发货事件
  deliveryEvent(e) {
    let {_id, openid} = this.data.orderInfo;
    wx.showModal({
      title: '提示',
      content: '确认发货吗？',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '数据更新中',
            mask: true,
          })
          wx.cloud.database().collection('orders')
            .where({
              _id,
              openid,
            })
            .update({
              data: {
                status: 2,
                deliveryTime: new Date().getTime(),
              }
            })
            .then(res => {
              wx.hideLoading({
                success: (res) => {},
              })
              wx.navigateBack({
                delta: 1,
              })
            })
            .catch(err => {
              console.log(err);
              wx.hideLoading({
                success: (res) => {},
              })
              wx.showToast({
                title: '订单发货失败',
                icon: 'error',
                mask: true,
              })
            })
        }

        if (res.cancel) {
          return
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
    // 检查地址，然后更新
    // let address = wx.getStorageSync('orderAddress');
    // console.log(address);
    // 获取订单id
    let _id = '';
    if (this.data.orderInfo) {
      _id = this.data.orderInfo._id;
    }
    let {changeOrderAddress} = app.globalData;
    if (changeOrderAddress) {
      console.log("订单id：", _id);
      console.log("更新的地址：", app.globalData.orderAddress);
      let orderAddress = app.globalData.orderAddress;
      wx.showLoading({
        title: '地址信息更新中',
        mask: true,
      })
      wx.cloud.database().collection('orders')
        .where({
          _id,
        })
        .update({
          data: {
            address: orderAddress,
          }
        })
        .then(res => {
          wx.hideLoading()
          console.log(res);
          app.globalData.changeOrderAddress = false;
          // 重新获取订单信息
          this.getOrderInfo(_id);
        })
        .catch(err => {
          wx.hideLoading()
          console.log(err);
          wx.showToast({
            title: '地址更新失败',
            icon: 'error',
            mask: true
          })
        })
    }
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