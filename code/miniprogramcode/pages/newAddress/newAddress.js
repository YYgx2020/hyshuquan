// pages/newAddress/newAddress.js
const app = getApp()
const reg = '/^1[3|4|5|7|8]\d{9}$/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsTouch: false,
    formData: {
      consignee: '',
      phone: '',
      area: '',
      detail: '',
    },
    hasEdit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    console.log(app.globalData.userInfo);
    let index = options.index;
    this.dataInit(index)
  },

  dataInit(index) {
    index = index * 1
    console.log('index: ', index);
    let checked = false,
      edit = false,
      detailsTouch = false;
    let formData = {
      consignee: '',
      phone: '',
      area: '',
      detail: '',
    };
    if (!isNaN(index)) {
      // 填充收货信息
      formData = app.globalData.userInfo.address[index]
      console.log(formData);
      edit = true;
      detailsTouch = true;
      if (index == 0) {
        checked = true;
      }
    }
    this.setData({
      index,
      checked,
      edit,
      detailsTouch,
      formData,
    })
  },

  getName(e) {
    let {
      formData
    } = this.data
    formData.consignee = e.detail.value;
    this.setData({
      formData,
      hasEdit: true,
    })
  },

  getPhone(e) {
    let {
      formData
    } = this.data
    if (e.detail.value.trim() && !(/^1[3|4|5|7|8]\d{9}$/.test(e.detail.value))) {
      wx.showModal({
        title: '提示',
        content: '手机号输入错误，请重新填写',
      })
      return
    }
    formData.phone = e.detail.value;
    this.setData({
      formData,
      hasEdit: true,
    })
  },

  detailsTouch() {
    this.setData({
      detailsTouch: true,
      hasEdit: true,
    })
  },

  closeTexteara() {
    let {
      formData
    } = this.data
    formData.detail = ''
    this.setData({
      detailsTouch: false,
      hasEdit: true,
    })
  },

  textareaInput(e) {
    let {
      formData
    } = this.data
    console.log(e);
    let timer = null
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (e.detail.value === '') {
        this.setData({
          detailsTouch: false,
          hasEdit: true,
        })
      } else {
        formData.detail = e.detail.value
        this.setData({
          formData,
          hasEdit: true,
        })
      }
    }, 100)
  },

  chooseArea() {
    this.setData({
      hasEdit: true,
    })
    wx.navigateTo({
      url: '/pages/citySelector/switchcity/switchcity',
    })

  },

  textareaBlur() {
    let {
      formData
    } = this.data;
    if (!formData.detail) {
      this.setData({
        formData,
        hasEdit: true,
      })
    }
  },

  // 设置默认收货地址的开关
  switchEvent(e) {
    // console.log(e);
    // let isDefault = false;
    // if (e.detail.value) {
    //   isDefault = true
    // }
    this.setData({
      isDefault: !this.data.isDefault,
      checked: !this.data.checked,
      hasEdit: true,
    })
  },

  // 
  deteleAddress() {
    let {
      index
    } = this.data;
    let {
      address
    } = JSON.parse(JSON.stringify(app.globalData.userInfo))
    let {
      collections,
      openid,
    } = app.globalData.userInfo
    address = address.filter((item, ind) => {
      return ind !== index
    })
    wx.cloud.callFunction({
        name: "updateUserInfo",
        data: {
          openid,
          address,
          collections,
        },
      }).then(res => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
        app.globalData.userInfo.address = address
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
        wx.redirectTo({
          url: '/pages/address/address'
        })
      })
      .catch(err => {
        wx.showModal({
          title: '提示',
          content: '操作失败, 请重新尝试',
        })
        console.log(err);
        return
      })
  },

  // 保存收货地址
  addressEvent() {
    let {
      formData,
      isDefault,
      index,
      edit,
      checked
    } = this.data;
    for (let k in formData) {
      if (!formData[k]) {
        // wx.showModal({
        //   title: "提示",
        //   content: '请填写完所有信息后再保存',
        // })
        wx.showToast({
          title: '请填写完整的收货信息',
          mask: true
        })
        return
      }
    }
    // 获取用户的收货地址信息
    let {
      address
    } = JSON.parse(JSON.stringify(app.globalData.userInfo))
    let {
      collections,
      openid,
    } = app.globalData.userInfo
    console.log(app.globalData.userInfo);
    // let collections = app.globalData.userInfo
    if (!edit) {
      if (isDefault) {
        address.unshift(formData)
      } else {
        address.push(formData)
      }
    } else {
      // 先修改信息，再看是否要交换位置
      address[index] = formData
      if (index === 0 && !checked && address.length > 1) {
        // 交换位置
        let temp = address[0];
        address[0] = address[1];
        address[1] = temp
      }
      if (index !== 0 && checked) {
        // 查看是否是默认的，不是则修改
        let temp = address[index]
        address = address.filter((item, ind) => {
          return ind !== index
        })
        console.log("address: ", address);
        address.unshift(temp)
      }
    }

    wx.showLoading({
      title: '地址信息保存中',
      mask: true
    })

    wx.cloud.callFunction({
        name: "updateUserInfo",
        data: {
          openid,
          address,
          collections,
        },
      }).then(res => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
        app.globalData.userInfo.address = address
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
        wx.redirectTo({
          url: '/pages/address/address'
        })
      })
      .catch(err => {
        wx.showModal({
          title: '提示',
          content: '操作失败, 请重新尝试',
        })
        console.log(err);
        return
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
    console.log(this.data);
    let {
      formData,
      address
    } = this.data;
    if (address) {
      let {
        province,
        city,
        district
      } = this.data.address;

      address = province + city + district;
      formData.area = address;
      this.setData({
        formData,
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
    let {
      hasEdit,
      index
    } = this.data;
    if (hasEdit) {
      wx.showModal({
        title: '提示',
        content: '是否保存刚才的修改？',
        confirmText: '保存',
        cancelText: '不保存',
        success: res => {
          if (res.confirm) {
            this.addressEvent();
            // let pages = getCurrentPages(); // 当前页面栈
            // if (pages.length > 0) {
            //   let beforePage = pages[pages.length - 1]; //获取上一个页面实例对象                      
            //   let e = {
            //     currentTarget: {
            //       dataset: {
            //         index,
            //       }
            //     }
            //   }
            //   beforePage.editAddress(e); //触发父页面中的方法  
            //   console.log(beforePage);                       
            // }
            // return
          }
          // if (res.cancel) {
          //   return
          // }
        }
      })
    }
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