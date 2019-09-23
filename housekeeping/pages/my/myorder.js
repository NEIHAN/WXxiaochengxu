var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
// pages/my/myorder.js
const app = getApp()

import {
  formatTime
} from '../../utils/util'
Page({
  bindUser: function(e) {
    app.bindUser(e, () => {

      this.setData({
        hasLogin: true
      })
      this.getOrderList()
      request.invite();
      // this.hasLogin=true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
    wx.showTabBar({
      animation: true,
    })
  },
  confirmPay(e) {
    var _this = this
    _this.data.messageData.keyword1.value = _this.data.params.order_id
    _this.data.messageData.keyword2.value = _this.data.params.service_items
    _this.data.messageData.keyword3.value = _this.data.params.service_date + ' ' + _this.data.params.service_time
    _this.data.messageData.keyword7.value = _this.data.params.dis_amount + '元'
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            header: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: 'post',
            url: 'https://www.zaihush.com/api/wxpay/getsessionkey',
            data: {
              code: res.code
            },
            success(data) {
              if (_this.data.radioSelect == 1) {
                wx.request({
                  header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  method: 'post',
                  url: 'https://www.zaihush.com/api/wxpay/cashier',
                  data: {
                    orderno: _this.data.params.order_id,
                    money: _this.data.params.order_total,
                    openid: data.data.openid,
                  },
                  //最终参数等后台开发
                  success(data1) {
                    console.log(data1);
                    if (data1.data.status == 0) {
                      wx.showToast({
                        title: data1.data.err,
                        icon: 'none'
                      })
                    } else {
                      wx.requestPayment({
                        'timeStamp': data1.data.res.timeStamp,
                        'nonceStr': data1.data.res.nonceStr,
                        'package': data1.data.res.package,
                        'signType': 'MD5',
                        'paySign': data1.data.res.paySign,
                        'success': function(res) {
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success'

                          })
                          _this.getOrderList()
                          _this.hideModal()

                          app.paysuccessMsg(e.detail.formId, _this.data.messageData)
                          // wx.reLaunch({
                          //   url: '/pages/index/paySuccess'
                          // })

                          wx.reLaunch({
                            url: "/pages/my/myorder"
                          })
                        },
                        'fail': function(res) {
                          wx.showToast({
                            title: '支付失败',
                            icon: 'none'
                          })
                        },
                        'complete': function(res) {}
                      })
                    }

                  }

                })
              } else if (_this.data.radioSelect == 0) {
                wx.request({
                  header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  method: 'post',
                  url: 'https://www.zaihush.com/api/wxpay/mem_payment',
                  data: {
                    orderno: _this.data.params.order_id,
                    money: _this.data.params.order_total,
                    open_id: data.data.openid,
                    user_id: wx.getStorageSync('user_id'),
                    coupon_id: _this.data.params.coupon_id ? _this.data.params.coupon_id : '',
                    pro_name: _this.data.params.service_items,
                    // pro_id:1,
                  },
                  //最终参数等后台开发
                  success(data1) {
                    console.log(data1);
                    if (data1.data.status == 1) {
                      wx.showToast({
                        title: '支付成功',
                      })
                      _this.setData({
                        orderList: [],
                        currentPage: 1,
                      })
                      _this.getOrderList()
                      _this.hideModal()

                      app.paysuccessMsg(e.detail.formId, _this.data.messageData)

                      // wx.reLaunch({
                      //   url: '/pages/index/paySuccess'
                      // })

                      wx.reLaunch({
                        url: "/pages/my/myorder"
                      })

                    } else {
                      wx.showToast({
                        title: data1.data.err,
                        icon: 'none',

                      })
                    }

                  },
                  'fail': function(res) {
                    wx.showToast({
                      title: '支付失败',
                    })
                  },

                })
              }
            }
          })
        }
      }
    })

  },
  toOrderDetail(e) {
    console.log(e)
    let order_id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/my/newOrderDetail?order_id=' + order_id,
    })
  },
  pay(e) {
    console.log(e);

    if (e.currentTarget.dataset.detail.order_type == 3) {
      this.setData({
        items: [
          // {name: '0', value: '会员卡', checked: 'true'},
          {
            name: '1',
            value: '微信',
            checked: 'true'
          }
        ],
      })
    } else {
      this.setData({
        items: [{
            name: '0',
            value: '会员卡',
            checked: 'true'
          },
          {
            name: '1',
            value: '微信'
          }
        ],
      })
    }
    wx.hideTabBar({
      animation: true,
    })

    this.setData({
      showModal: true,
      params: e.currentTarget.dataset.detail,
      radioSelect: this.data.items[0].name

    });
    app.getDefaultAddress((data) => {
      this.data.messageData.keyword4.value = data.linkman
      this.data.messageData.keyword5.value = data.loca_addr + '' + data.detail_addr
      this.data.messageData.keyword6.value = data.contact_num
    })



  },
  getOrderList() {
    if (app.globalData.hasLogin) {
      wx.showLoading()
      let page = this.data.currentPage
      let self = this;
      let selectedKey = ''
      for (var i in this.data) {
        let v = this.data[i]
        if (i.indexOf('selected') == 0 && i.length == ('selected'.length) + 1 && v == true) {
          selectedKey = i
        }
      }
      let order_state = {
        selected1: 'pay',
        selected2: 'bespoke',
        selected3: 'service',
        selected4: 'evaluate',
        selected5: 'finish',
      }[selectedKey]
      wx.request({
        method: 'get',
        url: 'https://www.zaihush.com/api/order/get_more',
        data: {
          user_id: app.globalData.userId,
          // order_type:1,
          page: page + 1,
          order_state: order_state
        },
        success({
          data
        }) {
          if (!data.ord.length && ((self.data.orderList || []).length > 0)) {

            wx.showToast({
              title: '没有更多订单了^_^',
              icon: 'none',

            })
            return false;
          }

          self.setData({

            'currentPage': page + 1
          })

          // order_type

          let arr = data.ord
          // let arr=data.ord.concat(data.ord).concat(data.ord).concat(data.ord)

          arr.forEach((item) => {
            if (item.order_type == 1) {
              item.S_order_type = '一般订单'
            } else if (item.order_type == 2) {
              item.S_order_type = '周期订单'

            } else if (item.order_type == 3) {
              item.S_order_type = '活动订单'
              item.service_long = item.service_duration

            }
            item.S_items_id = app.globalData.serviceItems[item.items_id - 0]
          })

          let orderList = self.data.orderList || []
          orderList = orderList.concat(arr)

          self.setData({
            'orderList': orderList
          })
          console.log('order list--:', data)
          // console.log('order list--:', orderList)

          wx.hideLoading()
        }

      })
    }
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      radioSelect: e.detail.value
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: false,
    currentPage: 0,
    orderList: null,
    pageNum: 1,
    selected1: false,
    selected2: false,
    selected3: true,
    selected4: false,
    selected5: false,
    showModal: false,
    tuikuaning: false,
    cancel_reason: '',
    totalPrice: 0,
    items: [{
        name: '0',
        value: '会员卡',
        checked: 'true'
      },
      {
        name: '1',
        value: '微信',
      }
    ],
    radioSelect: 0,
    params: {},
    refundShow: false,
    reason: [
      '暂时不需要服务了',
      '信息填错，重新下单',
      '时间冲突，重新下单',
      '太贵了，不想要了',
      '不知道服务如何，不要了',
    ],
    paramsId: '',
    orderId: '',
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
        "value": "广州市天河区天河路208号"
      },
      "keyword5": {
        "value": "广州市天河区天河路208号"
      },
      "keyword6": {
        "value": "广州市天河区天河路208号"
      },
      "keyword7": {
        "value": "广州市天河区天河路208号"
      },
      "keyword8": {
        "value": "感谢您的支持！如需修改订单，请进入小程序联系客服或致电客服"
      },
      "keyword9": {
        "value": "0754-89926941"
      },
    },
    messageData1: {
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
        "value": "广州市天河区天河路208号"
      },
      "keyword5": {
        "value": "您已申请退款，等待商家确认退款信息"
      },
    },

  },
  selected1: function(e) {
    this.setData({
      currentPage: 0,
      orderList: [],
      selected2: false,
      selected3: false,
      selected4: false,
      selected5: false,
      selected1: true
    })
    this.getOrderList()
  },
  selected2: function(e) {
    this.setData({
      orderList: [],
      currentPage: 0,
      selected1: false,
      selected3: false,
      selected4: false,
      selected5: false,
      selected2: true
    })
    this.getOrderList()
  },
  selected3: function(e) {
    this.setData({
      orderList: [],
      currentPage: 0,
      selected1: false,
      selected2: false,
      selected4: false,
      selected5: false,
      selected3: true
    })
    this.getOrderList()
  },
  selected4: function(e) {
    this.setData({
      orderList: [],
      currentPage: 0,
      selected1: false,
      selected2: false,
      selected3: false,
      selected5: false,
      selected4: true
    })
    this.getOrderList()
  },
  selected5: function(e) {
    this.setData({
      orderList: [],
      currentPage: 0,
      selected1: false,
      selected3: false,
      selected4: false,
      selected2: false,
      selected5: true
    })
    this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
    if (options.selected1) {
      this.setData({
        selected1: true,
        selected3: false,
      })
    } else if (options.selected4) {
      this.setData({
        selected3: false,
        selected4: true,

      })
    } else if (getApp().globalData.selected4) {
      getApp().globalData.selected4 = false;
      this.setData({
        selected3: false,
        selected4: true,

      })
    }else if (options.selected5) {
      this.setData({
        selected3: false,
        selected5: true
      })
    }
    this.getOrderList()
    this.setData({
      radioSelect: this.data.items[0].name
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

    if (getApp().globalData.selected4) {
      getApp().globalData.selected4 = false;
      this.setData({
        selected3: false,
        selected4: true,
      })
    }

    console.log("app.globalData.hasLogin--:", app.globalData.hasLogin)
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
    if (app.globalData.hasLogin) {
      // this.getOrderList()
    }

  },
  cancelRefund(e) {
    this.setData({
      tuikuaning: false
    })
  },
  confirmPayRefund(e) {
    const self = this;

    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'post',
      url: 'https://www.zaihush.com/api/order/get_refund',
      data: {
        id: self.data.paramsId,
        order_id: self.data.orderId,
        back: 1,
        cancel_reason: self.data.cancel_reason
      },
      success(data) {
        console.log(data)
        if (data.data.status == 1) {
          let date = new Date()
          self.data.messageData1.keyword4.value = formatTime(date)
          app.getFoundMsg(e.detail.formId, self.data.messageData1)
          self.setData({
            tuikuaning: false
          })
          wx.reLaunch({
            url: "/pages/my/myorder?selected3=1",
          })
          wx.showToast({
            title: '提交成功',
          })

        } else {
          wx.showToast({
            title: '提交失败',
          })
        }
      },
      fail() {
        wx.showToast({
          title: '提交失败',
        })
      }
    })
  },
  refundMoney(e) {
    const self = this;
    self.setData({
      refundShow: false,
      tuikuaning: true,
      cancel_reason: e.currentTarget.dataset.reason
    })

  },
  cancelReason() {
    this.setData({
      refundShow: false
    })
  },
  tuikuan(e) {
    // let id = e.currentTarget.dataset.id;
    // let order_id = e.currentTarget.dataset.orderid;
    // let back = 1;
    // const self = this;
    let detail = e.currentTarget.dataset.detail
    this.data.messageData1.keyword1.value = detail.service_items
    this.data.messageData1.keyword2.value = detail.order_id
    this.data.messageData1.keyword3.value = detail.dis_amount + '元'
    this.setData({
      paramsId: e.currentTarget.dataset.id,
      orderId: e.currentTarget.dataset.orderid,
      refundShow: true
    })

  },
  wancheng(e) {
    let id = e.target.dataset.id;
    let order_id = e.target.dataset.orderid;
    const self = this;
    wx.showModal({
      content: '您确认您的订单已经完成了吗？',
      cancelText: '未完成',
      confirmText: '确定',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            header: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: 'post',
            url: 'https://www.zaihush.com/api/order/get_status',
            data: {
              id: id,
              order_id: order_id
            },
            success(data) {
              console.log(data)
              if (data.data.status == 1) {
                wx.showToast({
                  title: '提交成功',
                })
                wx.reLaunch({
                  url: "/pages/my/myorder?selected4=1",
                })
              } else {
                wx.showToast({
                  title: '提交失败',
                  icon: 'none',

                })
              }
            },
            fail() {
              wx.showToast({
                title: '提交失败',
                icon: 'none',

              })
            }
          })
        } else if (res.cancel) {

        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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

    this.getOrderList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  //   return {
  //     title: '这服务超值！',
  //     imageUrl: 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/share_new.jpg',
  //     path: '/pages/index/index?url=',
  //   }
  // },
  onShareAppMessage: util.share,
})