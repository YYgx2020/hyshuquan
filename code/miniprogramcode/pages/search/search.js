// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText: '',
    searchData: [],
    showNone: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 取消搜索
  clearSearch() {
    console.log("取消");
    this.setData({
      inputText: '',
    })
  },

  // 点击搜索框跳转到搜索页面
  // searchEvent() {
  //   console.log('跳转到搜索页面');
  //   wx.navigateTo({
  //     url: '/pages/search/search',
  //   })
  // },

  // 获取输入框的内容
  getInputText(e) {
    console.log(e);
    this.setData({
      inputText: e.detail.value,
    })
  },

  // 搜索功能
  searchBtn(e) {
    let {
      inputText
    } = this.data
    if (inputText == '') {
      console.log("请输入搜索内容");
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '正在搜索中',
      })
      // 调用搜索接口
      wx.cloud.callFunction({
          name: 'getBookSearchResult',
          data: {
            keyword: inputText
          }
        })
        .then(res => {
          wx.hideLoading({
            success: (res) => {},
          })
          console.log("搜索结果：", res.result.data);
          let searchData = this.dealData(res.result.data);
          // if (searchData.length === 0) {
          //   console.log('提示搜索内容为空');
          // } 
          
          this.setData({
            searchData,
            showNone: !res.result.data.length ? true: false,
          })
        })
        .catch(err => {
          wx.hideLoading({
            success: (res) => {},
          })
          console.log("搜索失败");
          wx.showToast({
            title: '搜索失败',
            icon: 'error'
          })
        })
    }
  },

  // 处理图书数据
  // 数据处理函数
  dealData(bookAllData) {
    console.log("bookAllData: ", bookAllData);
    if (Object.keys(bookAllData).length === 0) {
      console.log('空对象');
      return
    }
    bookAllData = bookAllData.map((item, index) => {
      return {
        id: item.id,
        nums: item.nums,
        cover: item.cover,
        bookName: item.bookName,
        price: item.price,
        _id: item._id
      }
    })
    const bookAllDataLeft = bookAllData.filter((item, index) => {
      // console.log(index);
      if (index % 2 == 0) {
        return item
      }
    })
    // console.log(bookAllDataLeft);
    const bookAllDataRight = bookAllData.filter((item, index) => {
      if (index % 2 !== 0) {
        return item
      }
    })
    console.log("-------新数据处理完成");
    // 将左右两列数组写入 data 中
    bookAllData = {
      bookAllDataLeft,
      bookAllDataRight
    }
    this.setData({
      // 关闭下拉刷新
      triggered: false,
    })
    return bookAllData
  },

  // 跳转到图书详情页面
  toBookDetail(e) {
    console.log('跳转到图书详情页面', e);
    let {
      _id
    } = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/bookDetail/bookDetail?_id=${_id}`,
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