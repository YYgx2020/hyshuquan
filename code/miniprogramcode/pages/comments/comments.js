// pages/comments/comments.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentsList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options);
    wx.setNavigationBarTitle({
      title: '更多评论',
    })
    console.log(wx.getStorageSync('commentsList'));
    let commentsList = wx.getStorageSync('commentsList')
    this.dataInit(commentsList);
    // this.setData({
    //   commentsList: wx.getStorageSync('commentsList'),
    // })
  },

  dataInit(comments) {
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
    this.setData({
      comments,
    })
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