var request = require('../../../utils/request.js');
var util = require('../../../utils/util.js');

const app = getApp()
// pages/zht/integral1/integral1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    checkIn: false,
    isCheck: false,

    user: {},

    hasLogin: false,

    sign: [],
    avaPoints: 0,

    publicNum: 1,
    share: {
      share_num: 0,
      status: 1
    }

  },

  bindUser: function (e) {
    app.bindUser(e, () => {

      this.setData({
        hasLogin: true
      })
      this.digital();
      request.invite();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.digital();
    this.fxOk();
  },

  digital() {
    var that = this;
    request.ajax("index.php/api/sign/sign_list", {
      user_id: wx.getStorageSync('user_id') ? wx.getStorageSync('user_id') : ''
    }, function(data) {
      
      var myDate = new Date();
      var a = myDate.getDate() + "";
      if(a.length == 1){
        a = "0" + a;
      }
      myDate = (myDate.getMonth() + 1) + "." + a + "";
      var avaPoints = 0;
      if (data.res){
        data.res.sign.forEach((value) => {
          if (value.date.substr(0, 1) == "0") {
            value.date = value.date.slice(1);
          }
          // debugger;
          if (value.date == myDate) {
            value.date = "今天";
            value.isSign = true;
            if (value.status == 1) {
              that.setData({
                isCheck: true
              })
            }
            avaPoints = value.score;
          } else {
            value.isSign = false;
          }

        })

        that.setData({
          sign: data.res.sign,
          user: data.res.user[0],
          avaPoints: avaPoints
        });
      }
    });

    request.ajax("index.php/api/sign/is_follow", {
      user_id: wx.getStorageSync('user_id') ? wx.getStorageSync('user_id') : '',
      gzh_status: 2
    }, function (data) {

      var publicNum = 1;
      if (data.res){
        publicNum = data.res.status; 
      }

      that.setData({
        publicNum: publicNum
      });
    });

  },

  gzgzh(){
    request.ajax("index.php/api/sign/is_follow", {
      user_id: wx.getStorageSync('user_id') ? wx.getStorageSync('user_id') : '',
      gzh_status: 2
    }, function (data) {

      // var publicNum = 1;
      // if (data.res) {
      //   publicNum = data.res.status;
      // }

      wx.showModal({
        title: '提示',
        content: data.err,
        showCancel: false,//是否显示取消按钮
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    });
  },

  check() {
    if (this.data.isCheck) {
      return;
    }
    var that = this;
    request.ajax("index.php/api/sign/sign", {
      user_id: wx.getStorageSync('user_id') ? wx.getStorageSync('user_id') : '',
      score: that.data.avaPoints
    }, function (data) {
      if (data.res == "SUCCESS"){
        that.digital();

        that.setData({
          checkIn: true,
          isCheck: true
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '签到失败，请稍后重试',
          showCancel: false,//是否显示取消按钮
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    });
  },

  boxOk() {
    this.setData({
      checkIn: false
    })
  },

  fxOk(){
    console.log(this.data.share.status);
    if (this.data.share.status == 2){
      return;
    }

    var that = this;
    request.ajax("index.php/api/sign/share_group", {
      user_id: wx.getStorageSync('user_id') ? wx.getStorageSync('user_id') : ''
    }, function (data) {

      that.setData({
        share: data.res
      });
      wx.showToast({
        title: '分享成功',
        icon: 'success',
        duration: 2000
      });
      that.digital();
    });
  },

  index(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  evaluation(){
    getApp().globalData.selected4 = true;
    wx.switchTab({
      url: '/pages/my/myorder?selected4=1',
      success: function(){

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("app.globalData.hasLogin--:", app.globalData.hasLogin)
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
    if (app.globalData.hasLogin) {
      // this.getOrderList()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.digital();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: util.share
})