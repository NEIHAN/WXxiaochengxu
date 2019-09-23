var utils = require('utils/util.js');
var request = require('utils/request.js');
//app.js

let showLoading = function() {
  if (typeof(window) == 'undefined') {
    wx.showLoading()
  } else {

  }
}
let hideLoading = function() {
  if (typeof(window) == 'undefined') {
    wx.hideLoading()
  } else {

  }
}
var URL = '';
const ald = require('./utils/ald-stat.js')
App({
  data: {
    msgParams: {
      touser: 1, // openid
      template_id: '0FuCndl8iSWVu-WWJJCD5biAIorzLcoP4Ih05pifE8E', //所需下发的模板消息的id
      page: "", // 点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。 否
      form_id: 4, // 表单提交场景下，为 submit 事件带上的 formId；支付场景下，为本次支付的 prepay_id
      //data:'',// 	模板内容，不填则下发空模板
      color: '#000', // 模板内容字体的颜色，不填默认黑色 【废弃】 否
      //emphasis_keyword:3,// 模板需要放大的关键词，不填则默认无放大否
    }
  },
  bindUser(e, cb) {
    let self = this
    var userInfo = e.detail.userInfo
    wx.showLoading({
      success() {
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
                wx.setStorageSync('openId', JSON.parse(data.arr).openid)
                wx.getUserInfo({
                  success() {
                    // console.log("get user info success:",user)
                    // var userInfo = user.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    wx.request({
                      method: 'post',
                      header: {
                        "content-type": "application/x-www-form-urlencoded"
                      },
                      url: 'https://www.zaihush.com/api/user/useradd',
                      data: {
                        openid: JSON.parse(data.arr).openid,
                        NickName: nickName,
                        HeadUrl: avatarUrl
                      },
                      success(log) {
                        console.log(log);
                        let ok = log.data.arr.mobile_validated;
                        self.globalData.userId = log.data.arr.user_id
                        console.log(self.globalData)
                        self.globalData.prevUrl = './address';
                        wx.hideLoading();
                        if (ok === 1) {
                          // <<<<<<< HEAD


                          wx.setStorageSync('user_id', log.data.arr.user_id);
                          wx.setStorageSync('mobile', log.data.arr.mobile);
                          wx.setStorageSync('avatar', log.data.arr.avatar);


                          self.globalData.userId = log.data.arr.user_id
                          self.globalData.mobile = log.data.arr.mobile
                          self.globalData.hasLogin = true

                          console.log("fucku self global data--:", self.globalData)

                          // =======
                          //                                                     wx.hideLoading();
                          // >>>>>>> 402ad739b19f62ee5cf7e155617f8c9666c29783
                          cb()
                          self.hasLogin = true
                        } else {
                          wx.navigateTo({
                            url: '/pages/my/login',
                          })
                        }
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  getDefaultAddress(cb) {

    let app = this

    if (app.globalData.defaultAddress) {
      cb(app.globalData.defaultAddress)
      return false;
    }

    showLoading()
    wx.request({
      method: 'get',
      url: 'https://www.zaihush.com/api/address/index?user_id=' + (app.globalData.userId || '1'),
      success({
        data
      }) {
        console.log('address list data--:', data)


        if (data.err) {
          wx.showToast({
            title: data.err,
            icon: 'none',
            duration: 1500
          })
          hideLoading()
          return
        } else {
          if (data.adds.length == 0) {

            // wx.navigateBack
            // var pages = getCurrentPages()    //获取加载的页面
            //
            // var currentPage = pages[pages.length-1]    //获取当前页面的对象
            //
            // var url = currentPage.route||currentPage.__route__ //当前页面url
            //
            // var options = currentPage.options    //如果要获取url中所带的参数可以查看options
            //
            // console.log("url and options--:",pages,url,options)
            wx.navigateTo({
              url: '/pages/my/newaddress'
            })
          } else {
            let defaultAddress = data.adds.find((item) => item.is_default == 1) || data.adds[0]
            cb(defaultAddress)
          }
        }


        // ddress list data




        hideLoading()
      }
    })
  },
  getServiceId(str) {
    return this.globalData.serviceItems.indexOf(str) + 1
  },
  //获取服务详情页信息
  getServiceDetail(id, vm) {
    // let id=this.getServiceId(str)
    showLoading()
    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'post',
      url: 'https://www.zaihush.com/api/product/index',
      data: {
        id: id
      },
      success({
        data
      }) {

        // console.log('ajax data--:',data)
        vm.setData({
          d: data
        })
        // cb(data)
        wx.setStorageSync('detailAll', data.pro);

        hideLoading()
      }

    })
  },
  //获取预约基本信息
  getAppointmentBasicInfo(url, dataMap, vm) {
    showLoading()

    url = 'https://www.zaihush.com/api/product' + url

    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'post',
      url: url,
      data: dataMap,
      success({
        data
      }) {
        // console.log('ajax data--:',data)
        vm.setData({
          d: data
        })
        // cb(data)

        hideLoading()
      }

    })
  },
  //获取预约服务时间
  getServiceTime(url, dataMap, vm) {
    showLoading()

    url = 'https://www.zaihush.com/api/product' + url

    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'post',
      url: url,
      data: dataMap,
      success({
        data
      }) {
        // console.log('ajax data--:',data)
        vm.setData({
          d: data
        })
        // cb(data)

        hideLoading()
      }

    })
  },
  getOrderDetail(id, vm) {
    showLoading()

    url = 'https://www.zaihush.com/api/order/order_details'

    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'post',
      url: url,
      data: {
        order_id: id
      },
      success({
        data
      }) {
        // console.log('ajax data--:',data)
        vm.setData({
          d: data
        })
        // cb(data)

        hideLoading()
      }

    })
  },
  onShow: function(ops) {
    // console.log('appShare',ops.shareTicket)
    this.paysuccessMsg()
  },
  onLaunch: function(ops) {
    console.log('app.js', ops);
    // if (ops.scene == 1044) {
    //     console.log('appShare',ops.shareTicket)
    if (ops.query.userid){
      wx.setStorageSync('invitePeople', parseInt(ops.query.userid));
      request.invite();
    }
    if (ops.query.scene) {
      wx.setStorageSync('invitePeople', parseInt(ops.query.scene));
      request.invite();
    }
    request.ajax("index.php/api/sign/user_share", {
      type: 1
    }, function (data) {
      if (data.res.share){
        utils.shareData.tit = data.res.share.title;
        utils.shareData.imaUrl = data.res.share.image;
        utils.shareData.pt = data.res.share.path;
      }
    });

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({

      success: res => {
        // console.log('res---:',res)

        wx.getUserInfo({

          success: function(user) {

            // console.log('user info app.js--:',user)
          }
        })

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

  },
  
  //1.支付成功
  paysuccessMsg(formid, data) {
    this.data.msgParams.template_id = '0FuCndl8iSWVu-WWJJCD5biAIorzLcoP4Ih05pifE8E'
    this.data.msgParams.form_id = formid
    this.data.msgParams.page = 'pages/my/myorder?selected3=1'
    // this.data.msgParams.data=data
    for (var i in data) {

      this.data.msgParams[i] = data[i].value

    }
    let _this = this
    // this.getToken().then(function(data) {
    //   // console.log(data);
    //   // console.log('参数-----',_this.data.msgParams);
    //   // console.log('测试66666');
    //   wx.request({
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //     },
    //     method: 'post',
    //     url: 'https://www.zaihush.com/index.php/api/weixin/sendmessage',
    //     data: _this.data.msgParams,
    //     success(data1) {
    //       // console.log('halen接口返回------:', data1)


    //     }
    //   })
    // })
  },
  //2.退款申请
  getFoundMsg(formid, data) {
    this.data.msgParams.template_id = '39aAFjKgVE1rxWJbeI6WNh_BggWDhMjeVz5VMIpwm-k'
    this.data.msgParams.form_id = formid
    this.data.msgParams.page = '/pages/my/myorder?selected3=1'
    this.data.msgParams.data = data
    let _this = this
    
  },
  //3订单评价
  evaluateOrder(formid, data) {
    this.data.msgParams.template_id = 'SDcexiCCRB4UFFzWojRr6THqHnfY1Wf86mwp2uYoddw'
    this.data.msgParams.form_id = formid
    this.data.msgParams.page = '/pages/my/myorder?selected5=1'
    this.data.msgParams.data = data
    let _this = this
    
  },
  //4充值成功
  giveMoneyMsg(formid, data) {
    this.data.msgParams.template_id = 'rLNW2EtuQ6B89Z-TGlwQZZ1BKH_H2ZkHfi9Xa4XcrgU'
    this.data.msgParams.form_id = formid
    this.data.msgParams.page = '/pages/giveMoney/giveMoney'
    this.data.msgParams.data = data
    let _this = this
   
  },
  globalData: {
    hasLogin: wx.getStorageSync('user_id') ? true : false,
    defaultAddress: null,
    serviceItems: '日常保洁 夜间服务 整屋服务 深度保洁 空房开荒 家电维修 家电清洗'.split(' '),
    userId: wx.getStorageSync('user_id') || null,
    // userId:wx.getStorageSync('user_id')||null,
    mobile: wx.getStorageSync('mobile') || null,
    userInfo: null,
    globalColor: '#fd1438',
    openid: 1,
    selected4: false
  }

})