var util = require('../../utils/util.js');
// pages/my/newOrderDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: null,
    showModal: false,
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
    tuikuaning: false,
    cancel_reason: '',
  },
  cancelReason() {
    this.setData({
      refundShow: false
    })
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      radioSelect: e.detail.value
    })
  },
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  pay() {
    if (this.data.orderDetail.service_duration != '') {
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
    this.setData({
      showModal: true,
      radioSelect: this.data.items[0].name

    });
    app.getDefaultAddress((data) => {
      this.data.messageData.keyword4.value = data.linkman
      this.data.messageData.keyword5.value = data.loca_addr + '' + data.detail_addr
      this.data.messageData.keyword6.value = data.contact_num
    })

    this.data.messageData.keyword1.value = this.data.orderDetail.order_id
    this.data.messageData.keyword2.value = this.data.orderDetail.service_items
    this.data.messageData.keyword3.value = this.data.orderDetail.service_date + ' ' + this.data.orderDetail.service_time
    this.data.messageData.keyword7.value = this.data.orderDetail.dis_amount + '元'

  },
  confirmPay(e) {
    var _this = this
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
                    orderno: _this.data.orderDetail.order_id,
                    money: _this.data.orderDetail.order_total,
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
                    orderno: _this.data.orderDetail.order_id,
                    money: _this.data.orderDetail.order_total,
                    open_id: data.data.openid,
                    user_id: wx.getStorageSync('user_id'),
                    coupon_id: _this.data.orderDetail.coupon_id ? _this.data.orderDetail.coupon_id : '',
                    pro_name: _this.data.orderDetail.service_items,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    const self = this;
    let order_id = options.order_id;
    wx.request({
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      url: 'https://www.zaihush.com/api/order/order_details',
      data: {
        order_id: order_id
      },
      success({
        data
      }) {
        if (data.status == 1) {
          if (data.ord.tool.length) {
            data.ord.toolName = data.ord.tool.map(item => {
              return item.tool_name
            }).join('、')
          }
          var ord = data.ord;
          var rdCms = [];

          if(ord.rd_cm){
            var a = ord.rd_cm.split(",");
            for(var i=0; i<a.length; i++){
              rdCms[rdCms.length] = a[i];
            }
          }

          ord.rdCms = rdCms;

          self.setData({
            orderDetail: ord,
            detail: true
          })
          console.log(ord);
        } else {
          self.setData({
            detail: false
          })
        }
        console.log('order-detail------', data)
      }
    })
    self.setData({
      radioSelect: this.data.items[0].name
    })
  },
  refundMoney(e) {
    const self = this;
    self.setData({
      refundShow: false
    })
    wx.showModal({
      content: '您确定要申请退款吗？',
      cancelText: '再想想',
      confirmText: '是的',
      success: function(res) {
        if (res.confirm) {
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
              cancel_reason: e.currentTarget.dataset.reason
            },
            success(data) {
              console.log(data)
              if (data.data.status == 1) {

                wx.reLaunch({
                  url: "/pages/my/myorder?selected3=1",
                })
                wx.showToast({
                  title: '提交成功',
                })
                // self.selected3();

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
        } else if (res.cancel) {

        }
      }
    })

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
  tuikuan(e) {
    // let id = e.currentTarget.dataset.id;
    // let order_id = e.currentTarget.dataset.orderid;
    // let back = 1;
    // const self = this;
    this.data.messageData1.keyword1.value = this.data.orderDetail.service_items
    this.data.messageData1.keyword2.value = this.data.orderDetail.order_id
    this.data.messageData1.keyword3.value = this.data.orderDetail.dis_amount + '元'
    this.setData({
      paramsId: e.currentTarget.dataset.id,
      orderId: e.currentTarget.dataset.orderid,
      refundShow: true
    })

  },
  wancheng(e) {
    let id = e.currentTarget.dataset.id;
    let order_id = e.currentTarget.dataset.orderid;
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
  qupingjia(e) {
    let id = e.currentTarget.dataset.id;
    let order_id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/my/evaluate?id=' + id + '&order_id=' + order_id,
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