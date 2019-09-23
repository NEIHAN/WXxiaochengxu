var util = require('../../utils/util.js');
// pages/my/userBlance.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    act_list:[],

    myBlance: 0.0,
    user_id: app.globalData.userId || '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    wx.setNavigationBarTitle({
      title: '我的余额'
    })
    wx.showLoading({
      mask: true,
      success(req) {
        wx.request({
          method: 'get',
          url: 'https://www.zaihush.com/api/user/get_assets?user_id=' +  wx.getStorageSync('user_id'),
          success({ data }) {
            wx.hideLoading();
            self.setData({
              myBlance: data.list.assets
            })
            console.log(data)
          }
        })
      },
      fail(err) {
        console.log('失败', err)
        wx.hideLoading();
      }
    })
    wx.request({
      method:'get',
      url:'https://www.zaihush.com/api/index/index',
      success(res){
        let data=res.data
        self.setData({
          act_list:data.act_list
        })
      }
    })
  },
  //跳转活动二级页面
  goActivity(e){
    console.log('activity_id===',e);
    wx.navigateTo({
      url: '/pages/activity/activity?activity_id='+e.currentTarget.dataset.id
    })
  },
  giveMoney(){
    wx.switchTab({
      url: '../../pages/giveMoney/giveMoney',
    })
  },
  linkDetailFn() {
    const self = this;
    wx.navigateTo({
      url: '/pages/my/blanceDetail?user_id=' +  wx.getStorageSync('user_id'),
    })
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