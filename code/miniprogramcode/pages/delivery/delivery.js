// pages/delivery/delivery.js
import {formatTime} from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    tag: 1,
    deliverList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getOrderList();
  },

  // 切换
  changeEvent(e) {
    console.log(e);
    let {tag} = e.currentTarget.dataset;
    if (tag === '1') {
      this.setData({
        tag: 1,
      })
    } else {
      let {deliverList} = this.data;
      this.setData({
        tag: 2,
      })
      if (deliverList.length === 0) {
        wx.showLoading({
          title: '数据加载中',
          mask: true,
        })
        const db = wx.cloud.database()
        wx.cloud.database().collection('orders')
          .where({
            status: db.command.eq(2).or(db.command.eq(3)),
          })
          .get()
          .then(res => {
            wx.hideLoading({
              success: (res) => {},
            })
            console.log(res);
            deliverList = res.data.map(item => {
              let nums = item.goodsInfo;
              let len = 0;
              nums.forEach(element => {
                len += element.num
              });
              item.num = len;
              item.createTime = formatTime(item.createTime);
              return item;
            })
            this.setData({
              deliverList,
            })
          })
          .catch(err => {
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '数据加载失败',
              mask: true,
            })
          })
      }
      
    }
  },

  // 获取待发货订单列表
  getOrderList() {
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    wx.cloud.database().collection('orders')
      .orderBy('createTime', 'desc') // 按创建时间降序获取数据
      .where({
        status: 1
      })
      .skip(0) //从第几个数据开始
      .limit(10)
      .get()
      .then(res => {
        wx.hideLoading({
          success: (res) => {},
        })
        console.log(res);
        let orderList = res.data.map(item => {
          let nums = item.goodsInfo;
          let len = 0;
          nums.forEach(element => {
            len += element.num
          });
          item.num = len;
          item.createTime = formatTime(item.createTime);
          return item;
        })
        this.setData({
          orderList,
        })
      })
      .catch(err => {
        console.log(err);
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '数据加载失败',
          icon: 'error',
          mask: true,
        })
      })
  },

  // 跳转到订单详情页面
  // 跳转到订单详情页面
  toOrderDetailPage(e) {
    console.log(e);
    let {
      id
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?orderId=${id}&isAdmin=1`,
    })
  },

  // 订单发货功能
  deliveryEvent(e) {
    console.log(e);
    let {
      index
    } = e.currentTarget.dataset;
    let {
      orderList
    } = this.data;
    let {
      _id,
      openid
    } = orderList[index];
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
              // 重新拉取数据
              this.getOrderList();
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
    this.getOrderList();
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