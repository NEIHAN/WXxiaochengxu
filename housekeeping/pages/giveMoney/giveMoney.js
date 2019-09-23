var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
// pages/giveMoney/giveMoney.js
import {
  formatTime
} from '../../utils/util'

const app = getApp()
Page({
  bindUser: function(e) {
    app.bindUser(e, () => {
      this.setData({
        hasLogin: true,
        mobile: wx.getStorageSync('mobile')

      })
      this.getBanlance()
      this.payfale()
      request.invite();
      // this.hasLogin=true
    })

  },
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
          balance: data.list.assets
        })
      }
    })
  },
  bindKeyInput: function(e) {
    if (e.detail.value < 1) {
      wx.showToast({
        title: '充值金额太小了',
        icon: 'none'
      })
    } else {
      var rate = 0
      for (var i = 0; i < this.data.d.list.length; i++) {
        if (e.detail.value >= this.data.d.list[i].upperlimit && e.detail.value <= this.data.d.list[i].lowerlimit) {
          rate = this.data.d.list[i].rate
          break;
        }
      }
      if (e.detail.value > this.data.d.list[this.data.d.list.length - 1].lowerlimit) {
        rate = this.data.d.list[this.data.d.list.length - 1].rate
      }
      console.log(Number(e.detail.value), Number(rate));
      this.setData({
        inputMoney: e.detail.value,
        backMoney: Math.round(Number(e.detail.value) * Number(rate) * 100) / 100
      })
      this.setData({
        totalMoney: Number(e.detail.value) + this.data.backMoney
      })
    }

  },
  remarkChang(e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  /**
   * 充值
   */
  buy() {
    var _this = this
    if (this.data.inputMoney == '') return false;
    // if(this.data.address&&_this.data.address.addr_id&&wx.getStorageSync('detail')){
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            header: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: 'post',
            url: 'https://www.zaihush.com/api/payment/getsessionkey',
            data: {
              code: res.code
            },
            success(data) {
              console.log(_this.data.checked);
              _this.data.messageData.keyword3.value = _this.data.inputMoney
              _this.data.messageData.keyword4.value = _this.data.backMoney
              _this.data.messageData.keyword5.value = _this.data.totalMoney
              wx.request({
                header: {
                  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                method: 'post',
                url: 'https://www.zaihush.com/api/payment/createorder',
                data: {
                  openid: data.data.openid,
                  money: _this.data.inputMoney,
                  user_id: app.globalData.userId ? app.globalData.userId : 1, //判断登录用户
                  remarks: _this.data.remarks
                },
                //最终参数等后台开发

                success(data1) {
                  wx.requestPayment({
                    'timeStamp': data1.data.res.timeStamp,
                    'nonceStr': data1.data.res.nonceStr,
                    'package': data1.data.res.package,
                    'signType': 'MD5',
                    'paySign': data1.data.res.paySign,
                    'success': function(res) {
                      wx.showToast({
                        title: '支付成功',
                      })

                      let id = data1.data.res.package.split('=')[1]
                      let date = new Date()
                      _this.data.messageData.keyword1.value = formatTime(date)
                      _this.data.messageData.keyword2.value = data1.data.res.paySign

                      app.giveMoneyMsg(id, _this.data.messageData)

                      _this.getBanlance()

                    },
                    'fail': function(res) {
                      wx.showToast({
                        title: '支付失败',
                      })
                    },
                    'complete': function(res) {}
                  })
                }

              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    // }else{
    //     wx.showToast({
    //         title: '请添加地址和服务时间！'
    //
    //     })
    // }

  },
  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: false,
    d: null,
    balance: 0,
    mobile: 0,
    backMoney: 0,
    globalColor: app.globalData.globalColor,
    totalMoney: 0,
    remarks: '',
    inputMoney: '',
    positionShow: false,
    messageData: {
      "keyword1": {
        "value": "339208499"
      },
      "keyword2": {
        "value": "2015年01月05日 12:30"
      },
      "keyword3": {
        "value": "粤海喜来登酒店"
      },
      "keyword4": {
        "value": "点击反馈您的下单体验, 将帮助我们更好提升服务质量。评价后48小时内派送8元无门槛优惠券"
      },
      "keyword5": {
        "value": "0754-8992694"
      },
      "keyword6": {
        "value": "到账时间可能会有网络延迟，如30分钟后充值未到账请联系客服。"
      },

    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.hasLogin) {
      return false
    }
    this.getBanlance()

    this.payfale()
  },
  //获取充值赠送
  payfale() {
    let self = this
    wx.request({
      method: 'get',
      url: 'https://www.zaihush.com/api/recharge/index',
      success({
        data
      }) {
        console.log('give mone index data--:', data)
        self.setData({
          d: data
        })
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
    this.setData({
      hasLogin: app.globalData.hasLogin,
      mobile: wx.getStorageSync('mobile')
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      inputMoney: '',
      backMoney: 0,
      totalMoney: 0,
      remarks: '',
    })
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
  onShareAppMessage: function() {

  }
})