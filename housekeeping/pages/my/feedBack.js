var util = require('../../utils/util.js');
// pages/my/feedBack.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteMaxLen: 500, //备注最多字数
    textValue:'',//输入的内容
    user_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user_id: wx.getStorageSync('user_id')
    })
  },
  //字数限制  
  bindWordLimit: function (e) {
    var value = e.detail.value, len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      currentNoteLen: len, //当前字数
      textValue: value //输入的内容
      //limitNoteLen: this.data.noteMaxLen - len //剩余字数  
    });
  },  
  sendFeedBack(){//发送意见
    var textValue=this.data.textValue;
    var that = this;
    if(textValue==''){
      wx.showToast({
        title: '发送失败',
      })
    }
    
    else{
      wx.request({
        method: 'POST',
        url: 'https://www.zaihush.com/api/user/feedback?user_id=' + that.data.user_id + '&con=' + textValue,
        success({ data }) {
          wx.navigateTo({
            url: 'helpList',
          })
          
        }
      })
    }
    
   
    
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