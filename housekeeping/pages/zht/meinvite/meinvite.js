var request = require('../../../utils/request.js');
var util = require('../../../utils/util.js');
// pages/zht/meinvite/meinvite.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invite_num: 0,
    registered: [],
    order: []
  },

  yq(){
    wx.navigateTo({
      url: '/pages/zht/erweima/erweima',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.digital();
  },

  digital() {
    var that = this;
    request.ajax("index.php/api/sign/invitation_list", {
      user_id: wx.getStorageSync('user_id') ? wx.getStorageSync('user_id') : ''
    }, function (data) {

      console.log(data);
      that.setData({
        invite_num: data.res.user.invite_num,
        registered: data.res.registered,
        order: data.res.order,
      })
    });
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