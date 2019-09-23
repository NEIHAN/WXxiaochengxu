var request = require('../../../utils/request.js');
var util = require('../../../utils/util.js');
// pages/zht/invitefz/invitefz.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suAppear: false,
    code: 0,
    list1: {},
    list2: {}
  },

  suCopy(){
    this.setData({
      suAppear: true
    })
  },

  digital() {
    var that = this;
    request.ajax("index.php/api/sign/yqm", {
      user_id: wx.getStorageSync('user_id') ? wx.getStorageSync('user_id') : ''
    }, function (data) {

      that.setData({
        code: data.res.code
      })

    });

    request.ajax("index.php/api/sign/invite_friends", {}, function (data) {
      that.setData({
        list1: data.res.list1,
        list2: data.res.list2
      })

    });

  },

  copyText(){
    var that = this;
    wx.setClipboardData({
      data: that.data.code,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
    that.setData({
      suAppear: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.digital();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: util.share

})