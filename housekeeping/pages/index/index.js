//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var util = require('../../utils/util.js');
var qqmapsdk;

Page({

  onShareAppMessage: util.share,

  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  bindUserInfo() {
    this.setData({
      noLogin: false
    })
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

            // console.log('data---:',data)
            wx.getUserInfo({
              success(res) {
                // console.log("get user info success:",res)
              }
            })
          }
        })
      }
    })
  },
  onShow: function() {
    wx.removeStorageSync('activityAll')

    let addr = app.globalData.positionAddr;
    if (addr) {
      this.setData({
        address: addr,
        hasLogin: app.globalData.hasLogin

      })
    }
    this.setData({
      showAlert: !app.globalData.hasLogin

    })
  },
  getRedWallet() {
    var _this = this
    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'post',
      url: 'https://www.zaihush.com/api/index/new_user',
      data: {
        user_id: wx.getStorageSync('user_id') ? wx.getStorageSync('user_id') : ''
      },
      success({
        data
      }) {
        if (data.status == 2) {

          _this.setData({
            showAlert: false,
            noLogin: true
          })
        } else {
          wx.showModal({
            title: '',
            content: data.err,
            showCancel: false,
            success: function(res) {
              // console.log(res);
              if (res.confirm) {
                _this.closeAlertImg()
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  //跳转活动二级页面
  goActivity(e) {
    wx.navigateTo({
      url: '/pages/activity/activity?activity_id=' + e.currentTarget.dataset.id
    })
  },

  //轮播跳转
  carouselHref(e){
    if (this.data.d.banner[e.currentTarget.dataset.index].url == "#"){
      return;
    }
    wx.navigateTo({
      url: "/pages/index/url/url?url=" + this.data.d.banner[e.currentTarget.dataset.index].url,
    })
  },

  //跳转详情
  goDetail(e) {
    if (isNaN(e.currentTarget.dataset.id)){
      return;
    }
      
    console.log(e.currentTarget.dataset.id, e.currentTarget.dataset.catname);
    let yy1id = app.getServiceId(e.currentTarget.dataset.catname)
    wx.setStorageSync('yy1id', yy1id);
    wx.setStorageSync('bankuaiid', e.currentTarget.dataset.id);
    if (e.currentTarget.dataset.catname == '家电清洗') {
      wx.navigateTo({
        url: "/pages/index/homeRepair?id=" + e.currentTarget.dataset.id + '&&catname=' + e.currentTarget.dataset.catname
      })

    } else {
      wx.navigateTo({
        url: "detail?id=" + e.currentTarget.dataset.id + '&&catname=' + e.currentTarget.dataset.catname
      })
    }

  },
  data: {

    d: {},
    indicatorDots: true,
    autoplay: true,
    noLogin: false,
    interval: 3000,
    duration: 800,

    categoryList: {},
    huiseArr: [
      //   {
      //     name: "家电维修",
      //     src: "http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/homeRepair.jpg"
      // },
      {
        catname: "石材护理",
        image: "http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/deepClean.jpg"
      },
      {
        catname: "窗帘清洁",
        image: "http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/cleanCL.jpg"
      }, {
        catname: "甲醛治理",
        image: "http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/deepClean.jpg"
      },

      {
        catname: "除尘除螨",
        image: "http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/deepClean.jpg"
      },

    ],

    // huiseArr: [],

    alertBanner: '',
    showAlert: true,
    linkUrl: '',
    hasLogin: false,
    motto: 'Hello Worlddddd',
    userInfo: {},
    hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
    address: '',
    act_list: [],

    catLength: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })

  },

  onLoad: function(options) {
    console.log('分享成功，优惠券已经放入您的账户。', options);

    if (options.userid){

    }

    if (options.shareTickets) {
      wx.showModal({
        content: '分享成功，优惠券已经放入您的账户。',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    if (!wx.getStorageSync('user_id')) {
      wx.hideTabBar({
        animation: true,
      })
    }

    let self = this
    wx.request({
      method: 'get',
      url: 'https://www.zaihush.com/api/index/index',
      success(res) {
        let data = res.data
        let categoryList = {}
        self.setData({
          alertBanner: data.tc_banner[0].pic,
          linkUrl: data.tc_banner[0].url,
          act_list: data.act_list
        })
        app.globalData.linkUrl = data.tc_banner[0].url;

        for (var index = 0; index < data.category.length; index++) {
          let item = data.category[index];

          let outerIndex = parseInt(index / 8, 10) + 1,
            innerIndex = index % 8 - 1
          if (!categoryList[outerIndex]) {
            categoryList[outerIndex] = []
          }
          categoryList[outerIndex].push(item)
        }
        
        data.categoryList = categoryList
        self.setData({
          d: data,
          catLength: Math.ceil(data.category.length / 8)
        })
      }
    })
    qqmapsdk = new QQMapWX({ //申请的秘钥
      key: 'NSDBZ-Y3VR6-WLYST-MKHBO-RLTXH-Q2FOY'
    });
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {
            // console.log(addressRes);
            self.setData({
              wd: addressRes.result.location.lat,
              jd: addressRes.result.location.lng,
              address: addressRes.result.address
            })
          },
          fail: function() {},
        })
      },
      fail: function() {},
    })
  },

  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toreposition() { //首页顶部定位
    wx.navigateTo({
      url: './reposition',
    })
  },
  bindUser: function(e) {
    this.setData({
      noLogin: false
    })
    wx.showTabBar({
      animation: true,
    })

    app.bindUser(e, () => {
      this.setData({
        hasLogin: true
      })
      // app.getServiceDetail(13,this)
      wx.request({
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: 'post',
        url: 'https://www.zaihush.com/api/product/index',
        data: {
          id: 13
        },
        success({
          data
        }) {
          wx.setStorageSync('detailAll', data.pro);
          wx.navigateTo({
            url: '/pages/index/SingleReservation?catname=1&&yy1_id=1'
          })

        }

      })
      // this.hasLogin=true
    })
  },

  closeAlertImg() {
    this.setData({
      showAlert: false
    })
    wx.showTabBar({
      animation: true,
    })
    // this.data.showAlert = false;
  },
})