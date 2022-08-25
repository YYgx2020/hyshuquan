// pages/car/car.js
import {
  getUserProfile
} from '../../utils/auth';
const app = new getApp()
const reg1 = /^[1-9]+([0-9]{0,3})$/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    carData: [],
    goodNum: 0, // 商品选中总数
    totalPrice: 0.00, // 商品总额
    allChecked: false,
    edit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {
      userInfo
    } = app.globalData
    this.setData({
      userInfo,
    })
  },

  // 获取用户购物车信息
  getUserCarList() {
    let {
      userInfo
    } = app.globalData
    wx.showLoading({
      title: '',
      mask: true
    })
    wx.cloud.callFunction({
        name: 'getCarsData',
        data: {
          openid: userInfo.openid,
        }
      })
      .then(res => {
        wx.hideLoading({
          success: (res) => {},
        })
        console.log('res:', res);
        let carData = res.result.data;
        let goodNum = 0,
          totalPrice = 0.00;
        let allChecked = false;
        carData = carData.map(item => {
          // item.ckecked = true
          item.bookPrice = parseFloat(item.bookPrice)
          if (item.check) {
            goodNum++;
            totalPrice += item.bookPrice * item.num;
          }
          return item;
        })
        if (goodNum == carData.length) {
          allChecked = true;
        }
        totalPrice = totalPrice.toFixed(2)
        this.setData({
          carData: res.result.data,
          totalPrice,
          goodNum,
          allChecked
        })
      })
      .catch(err => {
        wx.hideLoading({
          success: (res) => {},
        })
        console.log('err: ', err);
        wx.showToast({
          title: '数据获取失败',
          icon: 'error',
          mask: true,
        })
      })
  },

  // 登录
  async login() {
    try {
      let p = await getUserProfile()
      console.log(p);
      if (p) {
        this.setData({
          userInfo: app.globalData.userInfo
        })
        // 获取用户的购物车列表信息
        this.getUserCarList();
      }
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '登录失败',
        icon: 'error',
        mask: true,
      })
    }
    // console.log(getUserProfile());
    // console.log(123);
  },

  // 编辑
  edit() {
    let {
      edit
    } = this.data;
    this.setData({
      edit: !edit,
    })
  },

  // 删除购物车商品
  deteleEvent() {
    let {
      goodNum, carData
    } = this.data;
    let that = this
    wx.showModal({
      title: '提示',
      content: `确认删除这${goodNum}个商品吗？`,
      success: async function(res) {
        if (res.confirm) {
          try {
            wx.showLoading({
              title: '',
              mask: true,
            })
            for (let i = 0; i < carData.length; i++) {
              if (carData[i].check) {
                await wx.cloud.database().collection('cars').where({
                  _id: carData[i]._id
                }).remove()
              }
            }
            // 重新拉取数据
            that.getUserCarList()
          } catch (error) {
            console.log(error);
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '数据更新失败',
              icon: "error",
              mask: true,
            })
          }
        }
        if (res.cancel) {
          return
        }
      }
    })
  },

  // 点击跳转到购物车页面
  toBookDetailPage(e) {
    console.log(e);
    let id = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: `/pages/bookDetail/bookDetail?_id=${id}`,
    })
  },

  // 单选事件
  checkSingle(e) {
    console.log(e);
    // 取反，然后更新，最后重新拉取数据
    let {
      id,
      check
    } = e.currentTarget.dataset;
    // 更新单条数据
    this.updateSignleItem(id, check)
  },

  // 减号事件
  subtractEvent(e) {
    let {
      id,
      num
    } = e.currentTarget.dataset
    if (num === 1) {
      return
    } else {
      this.updateNum(id, num - 1)
    }
  },

  changeNumEvent(e) {
    console.log(e);
    let {
      id,
      num
    } = e.currentTarget.dataset
    // wx.showModal({
    //   title: '提示',
    //   content: '确定吗？',
    // })
    wx.showModal({
      // title: '提示',
      // content: num,  // 添加这行代码后弹不出来了
      editable: true,
      placeholderText: '请输入1-1000的整数',
      success: res => {
        if (res.confirm) {
          if (!res.content.trim()) {
            return
          }
          if (reg1.test(res.content)) {
            num = parseInt(res.content)
            if (num > 1000) {
              wx.showToast({
                title: '请输入正确的数量',
                icon: 'none',
                mask: true
              })
            } else {
              this.updateNum(id, num)
            }
          } else {
            wx.showToast({
              title: '请输入正确的数量',
              icon: 'none',
              mask: true
            })
            // return
          }

        }
        if (res.cancel) {
          return
        }
      }
    })
  },

  // 加号事件
  addEvent(e) {
    let {
      id,
      num
    } = e.currentTarget.dataset
    // 更新数据
    this.updateNum(id, num + 1)
  },

  updateNum(_id, num) {
    // 更新数据
    wx.showLoading({
      title: '',
      mask: true
    })
    wx.cloud.database().collection('cars').where({
      _id,
    }).update({
      data: {
        num,
        check: true,
      }
    }).then(res => {
      wx.hideLoading({
        success: (res) => {},
      })
      this.getUserCarList()
    }).catch(err => {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: '数据更新失败',
        icon: "error",
        mask: true,
      })
    })
  },

  // 全选事件
  async checkboxChangeAll(e) {
    console.log('12');
    let {
      allChecked,
      carData
    } = this.data;
    try {
      wx.showLoading({
        title: '',
        mask: true,
      })
      for (let i = 0; i < carData.length; i++) {
        if (carData[i].check === allChecked) {
          await wx.cloud.database().collection('cars').where({
            _id: carData[i]._id
          }).update({
            data: {
              check: !carData[i].check
            }
          })
        }
      }
      // wx.hideLoading({
      //   success: (res) => {},
      // })
      // 重新拉取数据
      this.getUserCarList()
    } catch (error) {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: '数据更新失败',
        icon: "error",
        mask: true,
      })
    }
  },

  updateSignleItem(id, check) {
    wx.showLoading({
      title: '',
      mask: true
    })
    wx.cloud.database().collection('cars').where({
      _id: id,
    }).update({
      data: {
        check: !check,
      }
    }).then(res => {
      // console.log('更新结果：', res);
      this.getUserCarList();
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
    console.log('页面显示');
    console.log('拉取数据');
    let {
      userInfo
    } = app.globalData
    this.setData({
      userInfo,
    })
    if (userInfo) {
      this.getUserCarList()
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