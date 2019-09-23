var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
//index.js
//获取应用实例
const app = getApp()

Page({
  // onShareAppMessage: function() {

  //   return {
  //     title: '这服务超值！',
  //     imageUrl: 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/share_new.jpg',
  //     path: '/pages/index/index?url=',
  //   }
  // },
  onShareAppMessage: util.share,
  bindUser: function(e) {
    app.bindUser(e, () => {
      this.setData({
        hasLogin: app.globalData.hasLogin,
        noLogin: wx.getStorageSync('user_id') ? false : true,

        mobile: wx.getStorageSync('mobile'),
        avatar: wx.getStorageSync('avatar'),
      })
      this.getBanlance()
      this.getCouponNuim()
      request.invite();
    })

  },
  // bindGetUserInfo: function(e) {
  //     console.log(e)hasLogin
  // },
  //获取账户余额
  getBanlance() {
    var _this = this
    wx.request({
      method: 'get',
      url: 'https://www.zaihush.com/api/user/get_assets?user_id=' + wx.getStorageSync('user_id'),
      success({
        data
      }) {
        _this.setData({
          myBlance: data.list.assets
        })
      }
    })
  },
  //获取可用优惠券数量
  getCouponNuim() {
    var _this = this

    wx.request({
      method: 'get',
      url: 'https://www.zaihush.com/api/user/voucher?user_id=' + wx.getStorageSync('user_id'),
      success({
        data
      }) {
        if (data.nouses && data.nouses.length) {
          _this.setData({
            couponNum: data.nouses.length
          })
        }

      }
    })
  },
  logout: function() {
    var self = this
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function(sm) {
        if (sm.confirm) {
          wx.clearStorageSync()
          app.globalData.hasLogin = false
          noLogin: wx.getStorageSync('user_id') ? false : true,

            wx.reLaunch({
              url: "/pages/my/my",
            })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  data: {

    hasLogin: false,
    noLogin: wx.getStorageSync('user_id') ? false : true,
    // hidden: true,
    mobile: '',
    avatar: '',
    myBlance: 0,
    couponNum: 0

  },
  //
  bindUserInfo() {
    var _this = this
    wx.login({
      success(req) {
        wx.request({
          method: 'post',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          url: 'https://www.zaihush.com/api/user/useradd',
          data: {
            code: req.code
          },
          success({
            data
          }) {

            console.log('data---:', data)
            wx.getUserInfo({
              success(res) {
                console.log("get user info success:", res)
                _this.setData({
                  hasLogin: app.globalData.hasLogin,
                  noLogin: wx.getStorageSync('user_id') ? false : true,

                  mobile: wx.getStorageSync('mobile'),
                  avatar: res.userInfo.avatarUrl,
                })
              }
            })
          }
        })
      }
    })
  },
  onShow: function() {
    this.bindUserInfo()
    this.getBanlance()
    this.getCouponNuim()
  },

  onLoad: function() {},
})