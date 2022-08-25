// pages/bookDetail/bookDetail.js
import {getUserProfile} from '../../utils/auth';
const app = new getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookInfo: {}, // 当前页面图书的信息
    comments: [], // 评论信息
    current: '',
    imgUrl: '', //图片路径
    toView: 'product',
    tag: 0,
    h1: 0,
    h2: 0,
  },
  timeID: 0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    wx.setNavigationBarTitle({
      title: '商品详情',
    })
    console.log(options);
    this.getBookDetail(options._id)

  },

  // 页面初始化
  init() {
    let that = this
    wx.createSelectorQuery().select('#comments').boundingClientRect(function (rect) {
      console.log('rect.id: ', rect.id); // 节点的ID
      rect.dataset // 节点的dataset
      rect.left // 节点的左边界坐标
      rect.right // 节点的右边界坐标
      console.log('rect.top: ', rect.top); // 节点的上边界坐标
      that.setData({
        h1: rect.top - 50,
      })
      rect.bottom // 节点的下边界坐标
      rect.width // 节点的宽度
      console.log('rect.height: ', rect.height); // 节点的高度
    }).exec()
    wx.createSelectorQuery().select('#details').boundingClientRect(function (rect) {
      console.log('details-rect.id: ', rect.id); // 节点的ID
      rect.dataset // 节点的dataset
      rect.left // 节点的左边界坐标
      rect.right // 节点的右边界坐标
      console.log('details-rect.top: ', rect.top); // 节点的上边界坐标
      rect.bottom // 节点的下边界坐标
      rect.width // 节点的宽度
      console.log('details-rect.height: ', rect.height); // 节点的高度
      that.setData({
        h2: rect.top - 60,
      })
    }).exec()
  },

  // 锚点定位
  toViewClick(e) {
    let hash = e.currentTarget.dataset.hash;
    let tag = 0;
    if (hash == 'product') {
      tag = 0
    } else if (hash == 'comments') {
      tag = 1
    } else {
      tag = 2
    }
    this.setData({
      toView: e.currentTarget.dataset.hash,
      tag,
    })
  },

  // 页面滑动事件
  scrollEvent(e) {
    let {
      h1,
      h2,
      tag
    } = this.data;
    let that = this
    // console.log('scrollTop: ', e.detail.scrollTop);
    // console.log('h1: ', h1);
    // console.log('h2: ', h2);
    clearTimeout(this.timeID)
    this.timeID = setTimeout(() => {
      let scrollTop = e.detail.scrollTop
      console.log('定时器里面的高度：', e.detail.scrollTop);
      // console.log('h1: ', h1);
      // console.log('h2: ', h2);
      // console.log(h1 < scrollTop < h2);
      if (0 < scrollTop && scrollTop < h1) {
        // console.log('0');
        tag = 0
      } else if (h1 < scrollTop && scrollTop < h2) {
        // console.log('1');
        tag = 1
      } else if (scrollTop > h2) {
        // console.log('2');
        tag = 2
      }
      console.log('tag: ', tag);
      that.setData({
        tag,
      })
    }, 50)
  },

  // 获取图书数据
  getBookDetail(_id) {
    wx.cloud.database().collection('books').where({
        _id,
      })
      .get()
      .then(res => {
        wx.hideLoading({
          success: (res) => {},
        })
        console.log('数据获取成功：', res.data[0]);
        // this.bookInfo = res.data[0];
        // console.log('截取', res.data[0].comments.splice(0, 2));
        let comments = JSON.parse(JSON.stringify(res.data[0].comments)).splice(0, 2);
        comments = comments.map(item => {
          let star = item.star
          let arr = [];
          switch (star) {
            case '力荐':
              arr = [1, 2, 3, 4, 5]
              break
            case '推荐':
              arr = [1, 2, 3, 4]
              break
            case '还行':
              arr = [1, 2, 3]
              break
            case '较差':
              arr = [1, 2]
              break
            default:
              arr = [1]
              break
          }
          item.arr = arr
          return item
        });
        res.data[0].catalogue = res.data[0].catalogue.replace('(收起)', '').replace('· · · · · ·', '')
        // console.log('catalogue: ', );
        this.setData({
          bookInfo: res.data[0],
          comments,
        })
        this.init()
      })
      .catch(err => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showModal({
          title: '提示',
          content: '数据获取失败，请退出重试'
        })
        console.log('数据获取失败：', err);
      })
  },

  // 点击封面图放大查看
  clickImg(e) {
    // var imgUrl = this.data.imgUrl;
    let imgUrl = []
    imgUrl.push(e.currentTarget.dataset.src)
    wx.previewImage({
      urls: imgUrl, //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  },

  // 回到首页
  toIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 收藏图书
  collectionBook() {
    if (app.globalData.userInfo) {
      console.log('执行相应的操作');
    } else {
      console.log('请求授权获取用户信息');
      getUserProfile()
    }
  },

  async login() {
    try {
      let p = await getUserProfile()
      console.log(p);
      if (p) {
        this.setData({
          userInfo: app.globalData.userInfo
        })
        // 获取用户的购物车列表信息
        // this.getUserCarList();
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(getUserProfile());
    // console.log(123);
  },

  // 将当前图书加入购物车
  async addToCarEvent() {
    // 获取当前图书的部分信息
    let {_id, bookName, cover, price} = this.data.bookInfo
    let book = {
      _id,
      name: bookName,
      cover,
      price,
    }
    // 先检查是否登录
    try {
      let {userInfo} = app.globalData
      if (!userInfo) {
        let p = await getUserProfile()
        console.log(p);
        if (p) {
          // this.setData({
          //   userInfo: app.globalData.userInfo
          // })
          // // 获取用户的购物车列表信息
          this.addBookToCar(book)
          // this.getUserCarList();
        }
      } else {
        this.addBookToCar(book)
      }
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '登录失败',
        icon: 'error'
      })
    }
  },

  async addBookToCar(book) {
    /* 
      执行逻辑：
      1. 先去购物车表查看当前图书的 _id 和 openid 是否存在记录
        如果存在，则将该记录的 num 值加1
        如果不存在，则增加一条记录
    */
   wx.showLoading({
     title: '正在加入购物车',
     mask: true,
   })
   let {userInfo} = app.globalData
   try {
    let p1 = await wx.cloud.database().collection('cars').where({
      openid: userInfo.openid,
      bookID: book._id,
    }).get()
    console.log('p1: ', p1);
    if (p1.data.length === 1) {
      // 更新记录
      let p2 = wx.cloud.database().collection('cars').where({
        openid: userInfo.openid,
      }).update({
        data: {
          num: p1.data[0].num + 1
        }
      })
      console.log('p2: ', p2);
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        mask: true
      })
    } else {
      // 增加记录
      let p3 = await wx.cloud.database().collection('cars').add({
        data: {
          openid: userInfo.openid,
          bookID: book._id,
          bookName: book.name,
          bookPrice: book.price,
          bookCover: book.cover,
          num: 1,
          bookShop: '弘毅出版社旗舰店',
          check: true,
        }
      })
      console.log('p3: ', p3);
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        mask: true
      })
    }
   } catch (error) {
     wx.hideLoading({
       success: (res) => {},
     })
     console.log(error);
     wx.showToast({
       title: '添加购物车失败',
       icon: 'error',
       mask: true,
     })
   }
  },

  // 跳转到确认订单页面
  async toPayPage() {
    if (!app.globalData.userInfo) {
      await this.login()
      let {_id,} = this.data.bookInfo;
      wx.navigateTo({
        url: `/pages/payment/payment?_id=${_id}&entry=${'detail'}`,
      })
    } else {
      let {_id,} = this.data.bookInfo;
      wx.navigateTo({
        url: `/pages/payment/payment?_id=${_id}&entry=${'detail'}`,
      })
    }
  },

  // 展开评论
  openText(e) {
    // let {current} = this.data;
    console.log('当前索引：', e.currentTarget.dataset.index);
    // let {index} = e.currentTarget.dataset
    this.setData({
      current: e.currentTarget.dataset.index,
    })
  },

  // 收起评论
  closeText(e) {
    this.setData({
      current: '', // 至初值
    })
  },

  // 点击跳转到更多评论页面
  lookMoreComments() {
    let {
      bookInfo
    } = this.data;
    let commentsList = JSON.parse(JSON.stringify(bookInfo.comments))
    commentsList = commentsList.splice(2, bookInfo.comments.length - 1)
    wx.setStorageSync('commentsList', commentsList)
    console.log('commentsList: ', commentsList);
    wx.navigateTo({
      url: '/pages/comments/comments',
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