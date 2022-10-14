// index.js

// 获取应用实例
const app = getApp()

Page({
  data: {
    inputText: '',
    navId: 0, // 导航标识
    current: 0,
    isRefresher: true,
    // 分类存储图书
    allBookList: {}, // 全部
    literatureBookList: {}, // 文学
    novelBookList: {}, // 小说
    historyBookList: {}, // 历史文化
    socialBookList: {}, // 社会纪实
    scienceBookList: {}, // 科学新知
    artBookList: {}, // 艺术设计
    businessBookList: {}, // 商业经营
    cartoonBookList: {}, // 绘本漫画
    toTop: false,  // 显示返回顶部图标
    scroll_top: 20,
    bookSubcat: [{
        id: 0,
        subcat: "全部"
      },
      {
        // literature
        id: 1,
        subcat: "文学"
      },
      {
        // novel
        id: 2,
        subcat: "小说"
      },
      {
        // history
        id: 3,
        subcat: "历史文化"
      },
      {
        // social
        id: 4,
        subcat: "社会纪实"
      },
      {
        // science
        id: 5,
        subcat: "科学新知"
      },
      {
        // art
        id: 6,
        subcat: "艺术设计"
      },
      {
        // business
        id: 7,
        subcat: "商业经管"
      },
      {
        // cartoon
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
    // 获取管理员列表
    this.getAdminList();
  },

  // 获取管理员列表
  getAdminList() {
    wx.cloud.database().collection('admins')
      .get()
      .then(res => {
        console.log(res);
        app.globalData.adminList = res.data;
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 从缓存中获取预加载的数据并进行处理
  getBookList() {
    let {
      current,  // 这里没有用到，可以删除
      allBookList
    } = this.data

    // let bookAllData = wx.getStorageSync('bookAllData').list;
    let loadFlag = wx.getStorageSync('load')
    // 查看是否有下拉刷新行为
    if (!loadFlag) {
      allBookList = wx.getStorageSync('allBookList').list;
      // 数组调用 map 之后返回一个新数组
      allBookList = this.dealData(allBookList)
      // wx.setStorageSync(`${current}`, allBookList)
    } else {
      // 重新向数据库发送请求
      wx.showLoading({
        title: '数据加载中',
        icon: 'loading',
        mask: true
      })
      wx.cloud.callFunction({
          name: 'getBookList',
        })
        .then(res => {
          console.log("新数据加载完成");
          // wx.setStorageSync(`${current}`, res.result.list)
          allBookList = this.dealData(res.result.list)
          this.setData({
            allBookList,
          })
          wx.hideLoading()
          return
        })
        .catch(err => {
          console.log(err);
          wx.showLoading({
            title: '数据获取失败',
            icon: 'error'
          })
        })
    }
    // 关闭导航栏的刷新图标
    wx.hideNavigationBarLoading();
    this.setData({
      allBookList,
      triggered: false,
    })
    wx.hideLoading()
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
  async swiperChange(e) {
    let {
      bookSubcat,
      allBookList,
      literatureBookList,
      novelBookList,
      historyBookList,
      socialBookList,
      scienceBookList,
      artBookList,
      businessBookList,
      cartoonBookList,
    } = this.data
    console.log(e.detail.current);
    const current = e.detail.current
    // console.log("当前分类：", bookSubcat[current].subcat);
    // 获取分类标签
    const subcat = bookSubcat[current].subcat;
    // 先看data中当前分类有无数据，如果有则不请求，没有则发送请求
    try {
      switch (current) {
        // 全部
        case 0: {
          console.log("全部");
          if (Object.keys(allBookList).length === 0) {
            allBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
            this.setData({
              allBookList,
            })
            wx.hideLoading()
          }
          break
        }
        // 文学
        case 1: {
          if (Object.keys(literatureBookList).length === 0) {
            // console.log("数据：", await this.getBookSubcat(subcat));
            literatureBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
            this.setData({
              literatureBookList,
            })
            wx.hideLoading()
          }
          break
        }
        // 小说
        case 2: {
          if (Object.keys(novelBookList).length === 0) {
            novelBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
            this.setData({
              novelBookList,
            })
            wx.hideLoading()
          }
          break
        }
        // 历史文化
        case 3: {
          if (Object.keys(historyBookList).length === 0) {
            historyBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
            this.setData({
              historyBookList,
            })
            wx.hideLoading()
          }
          break
        }
        // 社会纪实
        case 4: {
          if (Object.keys(socialBookList).length === 0) {
            socialBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
            this.setData({
              socialBookList,
            })
            wx.hideLoading()
          }
          break
        }
        // 科学新知
        case 5: {
          if (Object.keys(scienceBookList).length === 0) {
            scienceBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
            this.setData({
              scienceBookList,
            })
            wx.hideLoading()
          }
          break
        }
        // 艺术设计
        case 6: {
          if (Object.keys(artBookList).length === 0) {
            artBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
            this.setData({
              artBookList,
            })
            wx.hideLoading()
          }
          break
        }
        // 商业经营
        case 7: {
          if (Object.keys(businessBookList).length === 0) {
            businessBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
            this.setData({
              businessBookList,
            })
            wx.hideLoading()
          }
          break
        }
        // 绘本漫画
        default: {
          if (Object.keys(cartoonBookList).length === 0) {
            cartoonBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
            this.setData({
              cartoonBookList,
            })
            wx.hideLoading()
          }
          break
        }
      }
    } catch (error) {
      console.log(error);
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '您的网络好像出现了问题，请检查您的网络',
      })
    }
    // 切换之后向数据库发送请求获取分类数据
    this.setData({
      current,
      subcat,
      navId: current
    })
  },

  // 发送请求获取分类图书数据
  getBookSubcat(subcat) {
    wx.showLoading({
      title: '数据加载中',
      icon: 'loading',
      mask: true
    })
    return wx.cloud.callFunction({
      name: 'getBookSubcat',
      data: {
        subcat,
      }
    })
  },

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

  // 监听页面滑动
  onScroll(e) {
    // console.log(e.detail.scrollTop);
    let {scrollTop} = e.detail
    if (scrollTop > 2000) {
      // console.log("显示返回顶部的图标");
      this.setData({
        toTop: true,
      })
    } else {
      this.setData({
        toTop: false,
      })
    }
  },

  // 返回顶部
  toTop() {
    this.setData({
      toTop: false,
      scroll_top: 0
    })
  },

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
  //     wx.showLoading({
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
  //       wx.showLoading({

  //         title: '搜索失败',
  //         icon: 'error'
  //       })
  //     })
  //   }
  // },

  // 下拉刷新
  onRefresh: function () {
    let {
      current,
      subcat
    } = this.data
    //导航条加载动画
    wx.showNavigationBarLoading()
    //loading 提示框
    wx.showLoading({
      title: 'Loading...',
    })
    console.log("下拉刷新啦");
    // 将数据加载标准更改
    wx.setStorageSync('load', true)
    if (current == 0) {
      this.getBookList()
    } else {
      // 其他页面的下拉刷新请求
      this.getOtherSubcatBook(current, subcat)
    }
    // setTimeout(function () {
    //   wx.hideLoading();
    //   wx.hideNavigationBarLoading();
    //   //停止下拉刷新
    //   wx.stopPullDownRefresh();
    // }, 1000)
  },

  async getOtherSubcatBook(current, subcat) {
    let {
      literatureBookList,
      novelBookList,
      historyBookList,
      socialBookList,
      scienceBookList,
      artBookList,
      businessBookList,
      cartoonBookList,
    } = this.data

    try {
      switch (current) {
        // 文学
        case 1: {
          // console.log("数据：", await this.getBookSubcat(subcat));
          literatureBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
          this.setData({
            literatureBookList,
            triggered: false,
          })
          // 关闭导航栏的刷新图标
          wx.hideNavigationBarLoading();
          wx.hideLoading()
          break
        }
        // 小说
        case 2: {
          novelBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
          this.setData({
            novelBookList,
          })
          // 关闭导航栏的刷新图标
          wx.hideNavigationBarLoading();
          wx.hideLoading()
          break
        }
        // 历史文化
        case 3: {
          historyBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
          this.setData({
            historyBookList,
          })
          // 关闭导航栏的刷新图标
          wx.hideNavigationBarLoading();
          wx.hideLoading()
          break
        }
        // 社会纪实
        case 4: {
          socialBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
          this.setData({
            socialBookList,
          })
          // 关闭导航栏的刷新图标
          wx.hideNavigationBarLoading();
          wx.hideLoading()
          break
        }
        // 科学新知
        case 5: {
          scienceBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
          this.setData({
            scienceBookList,
          })
          // 关闭导航栏的刷新图标
          wx.hideNavigationBarLoading();
          wx.hideLoading()
          break
        }
        // 艺术设计
        case 6: {
          artBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
          this.setData({
            artBookList,
          })
          // 关闭导航栏的刷新图标
          wx.hideNavigationBarLoading();
          wx.hideLoading()
          break
        }
        // 商业经营
        case 7: {
          businessBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
          this.setData({
            businessBookList,
          })
          // 关闭导航栏的刷新图标
          wx.hideNavigationBarLoading();
          wx.hideLoading()
          break
        }
        // 绘本漫画
        default: {
          cartoonBookList = this.dealData(await (await this.getBookSubcat(subcat)).result.list)
          this.setData({
            cartoonBookList,
          })
          // 关闭导航栏的刷新图标
          wx.hideNavigationBarLoading();
          wx.hideLoading()
          break
        }
      }
    } catch (error) {
      console.log(error);
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '您的网络好像出现了问题，请检查您的网络',
      })
    }
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

  onLower() {
    console.log("到底了");
    // 发送请求再次加载数据 
  },

  //触底函数
  onReachBottom() {
    console.log("上拉加载....");
  },

})