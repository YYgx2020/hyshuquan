// pages/order/order.js
const app = getApp();
import {
  formatTime
} from "../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [{
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
    orderDataAll: [],
    originData: [], // 初始数据
    searching: false, // 是否正在搜索
    inputText: '',
    searchList: [], // 搜索列表
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
    this.getOrderList('q');
  },

  // 获取订单数据
  /* 
  status：
  -1 - 已取消
  0 - 未付款
  1 - 已付款待发货
  2 - 已付款待收货
  3 - 已收货待评价
  */
  getOrderList(status) {
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    // 如果 status 是全部，则获取全部的数据
    if (status === 'q') {
      wx.cloud.database().collection('orders')
        .where({
          openid: app.globalData.openid
        })
        .get()
        .then(res => {
          wx.hideLoading({
            success: (res) => {},
          })
          console.log(res.data);
          let originData = JSON.parse(JSON.stringify(res.data)).reverse();
          let orderDataAll = res.data.map(item => {
            item.createTime = formatTime(item.createTime)
            return item;
          })
          this.setData({
            originData,
            orderDataAll: orderDataAll.reverse(),
          })
        })
        .catch(err => {
          wx.hideLoading({
            success: (res) => {},
          })
          console.log(err);
        })
    }
  },

  // 跳转到搜索订单页面
  searchEvent(e) {
    // console.log('跳转到搜索订单页面');
    let {
      orderDataAll
    } = this.data;
    let searchList = [];
    console.log(e);
    let inputText = e.detail.value;
    orderDataAll.forEach(item => {
      if (item.orderID === inputText) {
        searchList.push(item);
      } else {
        let data = item.goodsInfo;
        for (let i = 0; i < data.length; i++) {
          if (data[i].name.indexOf(inputText) !== -1) {
            searchList.push(item);
            break;
          }
        }
      }
    })

    this.setData({
      inputText,
      searching: true,
      searchList,
    })
  },

  // 取消搜索
  clearSearch() {
    console.log("取消");
    this.setData({
      inputText: '',
      searching: false,
    })
  },

  // 导航栏点击事件
  changeNav(e) {
    // console.log(e);
    let view = e.currentTarget.id;
    let index = e.currentTarget.dataset.index
    this.setData({
      view,
      current: index,
    })
  },

  swiperChange(e) {
    let {
      navList
    } = this.data;
    let index = e.detail.current
    let view = navList[index].id;
    this.setData({
      view,
      current: index,
    })
  },

  // 取消订单
  /* 
    先拿到当前订单的 id 和 openid，然后去更新数据库中的数据，最后再刷新页面重新获取数据
  */
  cancelOrderEvent(e) {
    console.log(e);
    let {
      orderDataAll
    } = this.data;
    let {
      index
    } = e.currentTarget.dataset;
    let {
      _id,
      openid
    } = orderDataAll[index];
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
        this.getOrderList('q');
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

  // 立即支付
  /* 
    支付逻辑：
    跳转到订单支付页面
  */
  payEvent(e) {
    console.log(e);
    // console.log(app.globalData);
    // let {userInfo} = app.globalData;
    let {
      originData
    } = this.data;
    let {
      index
    } = e.currentTarget.dataset;
    // let totalPrice = orderDataAll[index].totalPrice;
    // let createTime = orderDataAll[index].
    let {
      createTime,
      totalPrice
    } = originData[index];
    wx.setStorageSync('totalPrice', totalPrice);
    wx.setStorageSync('createTime', createTime);
    wx.navigateTo({
      url: '/pages/confirmPay/confirmPay',
    })
  },

  // 跳转到订单详情页面
  toOrderDetailPage(e) {
    console.log(e);
    let {
      id
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?orderId=${id}`,
    })
  },

  // 删除订单
  deteleEvent(e) {
    // 获取订单id
    let {
      orderDataAll
    } = this.data;
    let {
      index
    } = e.currentTarget.dataset;
    let {
      _id,
      openid
    } = orderDataAll[index];

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
              this.getOrderList('q')
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

  // 确认收货
  confirmEvent(e) {
    // 获取订单id
    let {
      orderDataAll
    } = this.data;
    let {
      index
    } = e.currentTarget.dataset;
    let {
      _id,
      openid
    } = orderDataAll[index];
    wx.showModal({
      title: '提示',
      content: '确定收到您的宝贝了吗？',
      success: res => {
        if (res.confirm) {
          console.log('删除订单');
          wx.showLoading({
            title: '订单更新中',
            mask: true,
          })
          wx.cloud.database().collection('orders')
            .where({
              _id,
              openid
            })
            .update({
              data: {
                status: 3,
                receiveTime: new Date().getTime(),
              }
            })
            .then(res => {
              console.log(res);
              wx.hideLoading({
                success: (res) => {},
              })
              this.getOrderList('q')
            })
            .catch(err => {
              wx.showToast({
                title: '确认收货失败',
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 刷新页面重新获取数据
    this.getOrderList('q');
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