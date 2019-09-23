var util = require('../../utils/util.js');
// pages/my/contactUs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    phonecall: '0754-89926941'
  },
  callMobile(){//客服电话
    // this.setData({
    //   hidden: false
    // })
    const self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.phonecall
    })
  },
  cancel() {
    this.setData({
      hidden: true
    })
  },
  confirm() {
    const self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.phonecall
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  // onShareAppMessage: function () {

  //   return {
  //     title: '这服务超值！',
  //     imageUrl: 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/share_new.jpg',
  //     path:'/pages/index/index?url=',
  //   }
  // },
  onShareAppMessage: util.share,
})