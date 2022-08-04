// index.js

// 获取应用实例
const app = getApp()

Page({
  data: {
    inputText: '',
    navId: 0, // 导航标识
    current: 0,
    isRefresher: true,
    bookSubcat: [{
        id: 0,
        subcat: "全部"
      },
      {
        id: 1,
        subcat: "文学"
      },
      {
        id: 2,
        subcat: "小说"
      },
      {
        id: 3,
        subcat: "历史文化"
      },
      {
        id: 4,
        subcat: "社会纪实"
      },
      {
        id: 5,
        subcat: "科学新知"
      },
      {
        id: 6,
        subcat: "艺术设计"
      },
      {
        id: 7,
        subcat: "商业经管"
      },
      {
        id: 8,
        subcat: "绘本漫画"
      },
    ], // 图书分类

  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: '弘毅书圈',
    })
    this.setData({
      isRefresher: true,
    })
    // 标志第一次进入小程序
    // wx.setStorageSync('firstIn', true)
    // 获取数据库数据
    this.getBookList()
  },

  // 从缓存中获取预加载的数据并进行处理
  getBookList() {
    let {current} = this.data
    // 关闭导航栏的刷新图标
    wx.hideNavigationBarLoading();
    // let bookAllData = wx.getStorageSync('bookAllData').list;
    let loadFlag = wx.getStorageSync('load')
    let bookAllData = []
    if (!loadFlag) {
      bookAllData = wx.getStorageSync('bookAllData').list;
      wx.setStorageSync(`${current}`, bookAllData)
    } else {
      // 重新向数据库发送请求
      // wx.showLoading({
      //   title: '数据加载中',
      // })
      wx.showToast({
        title: '数据加载中',
        icon: 'loading'
      })
      wx.cloud.callFunction({
          name: 'getBookList',
        })
        .then(res => {
          console.log("新数据加载完成");
          wx.setStorageSync(`${current}`, res.result.list)
          this.dealData(res.result.list)
          // wx.hideLoading()
          return
        })
        .catch(err => {
          console.log(err);
          wx.showToast({
            title: '数据获取失败',
            icon: 'error'
          })
        })
    }
    // 数组调用 map 之后返回一个新数组
    this.dealData(bookAllData)
    this.setData({
      triggered: false,
    })
    // wx.hideLoading()
  },

  // 获取分类图书
  getSubcat(subcat) {
    wx.cloud.callFunction({
        name: 'getBookSubcat',
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 导航栏点击事件
  changeNav(e) {
    let navId = e.currentTarget.id;
    this.setData({
      navId: navId * 1,
      current: navId * 1,
    })
  },

  // 监听swiper变换事件
  swiperChange(e) {
    let {bookSubcat} = this.data
    console.log(e.detail.current);
    const current = e.detail.current
    console.log("当前分类：", bookSubcat[current].subcat);
    const subcat = bookSubcat[current].subcat;
    // 先看存储中有没有当前的分类，如果有则不请求，没有则发送请求
    let bookAllData = wx.getStorageSync(current + '')
    console.log(bookAllData == '');
    if (bookAllData == '') {
      // 发送请求获取数据
      wx.showToast({
        title: '数据加载中',
        icon: 'loading'
      })
      wx.cloud.callFunction({
        name: 'getBookSubcat',
        data: {
          subcat,
        }
      })
      .then(res => {
        console.log(res);
        // 将数据写入缓存中
        wx.setStorageSync(`${current}`, res.result.list)
        this.dealData(res.result.list)
      })
      .catch(err => {
        console.log(err);
        wx.showToast({
          title: '加载失败',
          icon: 'error'
        })
      })
    } else {
      this.dealData(wx.getStorageSync(current + ''))
    }
    // 切换之后向数据库发送请求获取分类数据
    this.setData({
      current,
      navId: current
    })
  },

  // 数据处理函数
  dealData(bookAllData) {
    bookAllData = bookAllData.map((item, index) => {
      return {
        id: item.id,
        nums: item.nums,
        cover: item.cover,
        bookName: item.bookName,
        price: item.price,
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
    this.setData({
      bookAllDataLeft,
      bookAllDataRight
    })
    return
  },

  // scroll-view下拉刷新事件
  onPulling(e) { //下拉中
    // console.log(e, 'pulling')
  },


  onRestore(e) { //复位
    // console.log(e, 'restore')
  },

  onAbort(e) { //没有下拉到refresher-threshold值
    // console.log(e, 'abort')
  },

  // 输入框事件
  // handleInputEvent(e) {
  //   let {
  //     inputText
  //   } = this.data;
  //   console.log(e.detail.value);
  //   inputText = e.detail.value
  //   this.setData({
  //     inputText
  //   })

  // },

  // 取消搜索
  clearSearch() {
    console.log("取消");
    this.setData({
      inputText: '',
    })
  },

  // 点击搜索框跳转到搜索页面
  searchEvent() {
    console.log('跳转到搜索页面');
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  // 搜索功能
  // searchBtn(e) {
  //   let {
  //     inputText
  //   } = this.data
  //   if (inputText == '') {
  //     console.log("请输入搜索内容");
  //     wx.showToast({
  //       title: "请输入搜索内容",
  //       icon: 'none'
  //     })
  //   } else {
  //     // 调用搜索接口
  //     wx.cloud.callFunction({
  //       name: 'getBookSearchResult',
  //       data: {
  //         keyword: inputText
  //       }
  //     })
  //     .then(res => {
  //       console.log("搜索结果：", res);
  //     })
  //     .catch(err => {
  //       console.log("搜索失败");
  //       wx.showToast({

  //         title: '搜索失败',
  //         icon: 'error'
  //       })
  //     })
  //   }
  // },

  // 下拉刷新
  onRefresh: function () {
    //导航条加载动画
    wx.showNavigationBarLoading()
    //loading 提示框
    wx.showLoading({
      title: 'Loading...',
    })
    console.log("下拉刷新啦");
    // 将数据加载标准更改
    wx.setStorageSync('load', true)
    this.getBookList()
    // setTimeout(function () {
    //   wx.hideLoading();
    //   wx.hideNavigationBarLoading();
    //   //停止下拉刷新
    //   wx.stopPullDownRefresh();
    // }, 1000)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onRefresh();
    // 关闭导航栏刷新图标
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },


})