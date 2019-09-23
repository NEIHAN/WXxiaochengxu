var util = require('../../utils/util.js');
// pages/my/fuwushijian.js
const app = getApp()

Page({
  // onShareAppMessage: function () {

  //   return {
  //     title: '这服务超值！',
  //     imageUrl: 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/share_new.jpg',
  //     path:'/pages/index/index?url=',
  //   }
  // },
  onShareAppMessage: util.share,
  /**
   * 页面的初始数据
   */
  data: {
    activityAll: {},
    name: '',
    value: '',
    time: '',
    totalPrice: '',
    address: null,
    id: '',
    array: ['美国', '中国', '巴西', '日本'],
    index: 0,
    service_num: '',
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
    taskvalue: '',
    radioSelect: 0,
    paramsObj: {},
    fromPeriod: false,
    fromHomeRepair: false,
    fromActivity: false,
    servicePeriod: '',
    serviceHours: '',
    serTime: '',
    serviceTime: '',
    serviceFirst: '',
    cleaner_price: '',
    totalCalc: 0,
    cleaner_unit: '',
    checked: false,
    canNext: true,
    couponSelect: '请选择优惠券',
    yy1id: 1,
    homeRepairShow: {},
    minute: 114,
    second: 59,
    clean_price: '',
    peopleNum: '',
    myBlance: 0,
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
    }

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
          myBlance: data.list.assets
        })

      }
    })
  },
  serviceValChange(e) {
    console.log(e.detail.value);
    if (e.detail.value.length) {
      this.setData({
        checked: true
      })
    } else {
      this.setData({
        checked: false
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
   * 弹窗
   */
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function(e) {
    e.preventDefault()
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    var _this = this
    wx.showModal({
      title: '',
      content: '便宜不等人，请三思而行~',
      success: function(res) {
        if (res.confirm) {
          _this.setData({
            showModal: false
          });
          wx.reLaunch({
            url: "/pages/my/myorder?selected1=1"
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  bindKeyInput: function(e) {
    this.setData({
      taskvalue: e.detail.value
    })
  },
  confirmPay(e) {
    console.log(e);
    var _this = this
    if (_this.data.canNext) {
      _this.setData({
        canNext: false
      })
      if (this.data.radioSelect == 1) {
        wx.request({
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          method: 'post',
          url: 'https://www.zaihush.com/api/wxpay/cashier',
          data: {
            orderno: _this.data.paramsObj.orderno,
            money: _this.data.paramsObj.money,
            openid: _this.data.paramsObj.open_id,
          },
          //最终参数等后台开发
          success(data1) {
            console.log(data1);
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
                app.paysuccessMsg(e.detail.formId, _this.data.messageData)

                _this.setData({
                  showModal: false,
                  canNext: true
                });

                wx.reLaunch({
                  url: "/pages/my/myorder"
                })
                // wx.reLaunch({
                //   url: '/pages/index/paySuccess'
                // })
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
      } else if (this.data.radioSelect == 0) {
        wx.request({
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          method: 'post',
          url: 'https://www.zaihush.com/api/wxpay/mem_payment',
          data: {
            orderno: _this.data.paramsObj.orderno,
            money: _this.data.paramsObj.money,
            open_id: _this.data.paramsObj.open_id,
            user_id: _this.data.paramsObj.user_id,
            coupon_id: _this.data.paramsObj.coupon_id,
            // pro_id:_this.data.paramsObj.pro_id,
            pro_name: _this.data.paramsObj.pro_name,
          },
          //最终参数等后台开发
          success(data1) {
            console.log(data1);
            if (data1.data.status == 1) {
              wx.showToast({
                title: '支付成功',
              })
              app.paysuccessMsg(e.detail.formId, _this.data.messageData)

              _this.setData({
                showModal: false,
                canNext: true
              });
              wx.reLaunch({
                url: '/pages/my/myorder'
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


  },
  pay() {

    var _this = this
    _this.setData({
      minute: 14,
      second: 59,
    })
    // if(wx.getStorageSync('coupon')){
    //   _this.setData({
    //    totalCalc:_this.data. totalPrice-Number(wx.getStorageSync('coupon').coupon_money)
    //   })
    // }else{
    _this.setData({
      totalCalc: _this.data.totalPrice
    })
    // }
    clearInterval(timer)
    var timer = setInterval(() => {
      _this.setData({
        second: _this.data.second - 1
      })

      if (_this.data.second == '00' && _this.data.minute == '00') {
        _this.setData({
          minute: 14,
          second: 59,
        })
      }; //当分钟和秒钟都为00时，重新给值
      if (_this.data.second == '00') {
        _this.setData({
          second: 59,
          minute: _this.data.minute - 1
        })
        if (_this.data.minute < 10)
          _this.setData({
            minute: "0" + _this.data.minute
          })
      }; //当秒钟为00时，秒数重新给值
      if (_this.data.second < 10)
        _this.setData({
          second: "0" + _this.data.second
        })
    }, 1000);
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
              _this.setData({
                openid: data.data.openid
              })
              var paramsObj = {}
              //    fromActivity:false,
              if (_this.data.fromActivity) {
                paramsObj = {
                  user_id: app.globalData.userId ? app.globalData.userId : 1, //判断登录用户
                  addr_id: _this.data.address.addr_id,
                  coupon_id: wx.getStorageSync('coupon') ? +wx.getStorageSync('coupon').coupon_id : '',
                  activity_id: wx.getStorageSync('activityAll').activity_id,
                  act_item_id: wx.getStorageSync('activityAll').act_item_id,
                  tool_id: wx.getStorageSync('activityAll').tool_id,
                  service_id: wx.getStorageSync('activityAll').service_id,
                  order_activity: wx.getStorageSync('activityAll').order_activity,
                  remarks: _this.data.taskvalue,
                  openid: data.data.openid,

                }
                wx.request({
                  header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  method: 'post',
                  dataType: 'json',
                  url: 'https://www.zaihush.com/index.php/api/wxpay/actcreateorder',
                  data: paramsObj,
                  //最终参数等后台开发
                  success(data1) {
                    console.log('actcreateorder---', data1);
                    if (data1.data.status == 1) {
                      _this.setData({
                        paramsObj: data1.data.res,

                      })
                      _this.showDialogBtn()
                    } else {
                      wx.showToast({
                        title: '出错了'
                      })
                    }


                  }

                })
              } else {
                if (_this.data.fromHomeRepair) {
                  paramsObj = {
                    openid: data.data.openid,
                    pro_id: wx.getStorageSync('detailAll').id,
                    user_id: app.globalData.userId ? app.globalData.userId : 1, //判断登录用户
                    addr_id: _this.data.address.addr_id,
                    coupon_id: wx.getStorageSync('coupon') ? +wx.getStorageSync('coupon').coupon_id : '',
                    service_date: wx.getStorageSync('detail').activeDay.split('/')[1],
                    service_time: wx.getStorageSync('detail').activeDay.split('/')[0],
                    service_long: wx.getStorageSync('detailAll').num,
                    service_brand: _this.data.homeRepairShow.brand,
                    service_type: _this.data.homeRepairShow.type,
                    order_type: 1, //先传1 一般订单
                    remarks: _this.data.taskvalue
                  }

                } else {
                  if (_this.data.fromPeriod) {

                    paramsObj = {
                      openid: data.data.openid,
                      pro_id: _this.data.id,
                      user_id: app.globalData.userId ? app.globalData.userId : 1, //判断登录用户
                      addr_id: _this.data.address.addr_id,
                      coupon_id: wx.getStorageSync('coupon') ? +wx.getStorageSync('coupon').coupon_id : '',
                      order_type: 2,
                      remarks: _this.data.taskvalue,
                      service_count: _this.data.servicePeriod,
                      service_cycle: wx.getStorageSync('periodDetail').serTime,
                      first_service: wx.getStorageSync('periodDetail').serviceFirst.split(' ')[0],
                      // service_date: wx.getStorageSync('periodDetail').serviceFirst.split(' ')[0]+'('+wx.getStorageSync('periodDetail').serviceTime.split('/')[0]+')',
                      service_date: wx.getStorageSync('periodDetail').serviceFirst.split(' ')[0],
                      service_time: wx.getStorageSync('periodDetail').serviceTime.split('/')[1],
                      service_num: wx.getStorageSync('periodNum'),
                      service_long: wx.getStorageSync('periodDetail').serviceHours,
                    }
                  } else if (_this.data.id == 10){

                    var cmtype = wx.getStorageSync('detailAll').cmtype;
                    var rdlist = [];
                    for (var i = 0; i < cmtype.length; i++){
                      var a = {
                        rd_id: cmtype[i].rd_id,
                        rd_num: cmtype[i].quant
                      }
                      rdlist[rdlist.length] = a;
                    }

                    paramsObj = {
                      openid: data.data.openid,
                      pro_id: _this.data.id,
                      user_id: app.globalData.userId ? app.globalData.userId : 1, //判断登录用户
                      addr_id: _this.data.address.addr_id,
                      coupon_id: wx.getStorageSync('coupon') ? +wx.getStorageSync('coupon').coupon_id : 0,
                      service_date: wx.getStorageSync('detail').activeDay.split('/')[1],
                      service_time: wx.getStorageSync('detail').activeDay.split('/')[0],
                      order_type: 1, //先传1 一般订单
                      service_long: 1,
                      remarks: _this.data.taskvalue,
                      rdlist: JSON.stringify(rdlist)
                    }
                    
                  } else {
                    paramsObj = {
                      openid: data.data.openid,
                      pro_id: _this.data.id,
                      user_id: app.globalData.userId ? app.globalData.userId : 1, //判断登录用户
                      addr_id: _this.data.address.addr_id,
                      coupon_id: wx.getStorageSync('coupon') ? +wx.getStorageSync('coupon').coupon_id : '',
                      // service_date:wx.getStorageSync('detail').activeDay.split('/')[1]+'('+wx.getStorageSync('detail').activeDate+')',
                      service_date: wx.getStorageSync('detail').activeDay.split('/')[1],
                      service_time: wx.getStorageSync('detail').activeDay.split('/')[0],
                      square_num: wx.getStorageSync('roomType').inputValue ? wx.getStorageSync('roomType').inputValue : 0,
                      service_num: wx.getStorageSync('roomType').service_num ? wx.getStorageSync('roomType').service_num : wx.getStorageSync('detail').peopleNum,
                      service_long: wx.getStorageSync('roomType') ? wx.getStorageSync('roomType').total_time : wx.getStorageSync('detail').value,
                      cleaner_price: wx.getStorageSync('checked') ? wx.getStorageSync('checked') : '',
                      order_type: 1, //先传1 一般订单
                      remarks: _this.data.taskvalue
                    }
                    if (_this.data.yy1id == 3) {
                      paramsObj.service_long = wx.getStorageSync('roomType').total_time

                    }
                  }


                }
                wx.request({
                  header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  method: 'post',
                  url: 'https://www.zaihush.com/api/wxpay/createorder',
                  data: paramsObj,
                  //最终参数等后台开发
                  success(data1) {
                    console.log(data1);
                    if (data1.data.status == 1) {
                      _this.setData({
                        paramsObj: data1.data.res,

                      })
                      _this.data.messageData.keyword1.value = data1.data.res.orderno
                      _this.data.messageData.keyword2.value = data1.data.res.pro_name
                      _this.data.messageData.keyword3.value = _this.data.time
                      _this.data.messageData.keyword4.value = _this.data.address.linkman
                      _this.data.messageData.keyword6.value = _this.data.address.contact_num
                      _this.data.messageData.keyword7.value = _this.data.totalPrice + '元'


                      _this.showDialogBtn()
                    } else {
                      wx.showToast({
                        title: data1.data.err,
                      })
                    }


                  }

                })
              }

            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  //获取优惠券
  getCoupon() {
    wx.request({
      method: 'get',
      url: 'https://www.zaihush.com/api/user/voucher?user_id=' + wx.getStorageSync('user_id'),
      success({
        data
      }) {
        console.log(data);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.getBanlance()
    wx.showShareMenu({
      withShareTicket: true
    })
    //获取优惠券
    // this.getCoupon()
    wx.removeStorageSync('coupon') //初次进来清空缓存的优惠券
    if (options.fromActivity == 1) {
      this.setData({
        fromActivity: true,
        activityAll: wx.getStorageSync('activityAll'),
        activityAll_tool_name: wx.getStorageSync('activityAll').tool_name.join('、'),
        totalPrice: wx.getStorageSync('activityAll').total,
        items: [{
          name: '1',
          value: '微信',
          checked: 'true'
        }]
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
            value: '微信',
          }
        ],
        peopleNum: wx.getStorageSync('detail') ? wx.getStorageSync('detail').peopleNum : '',
        yy1id: wx.getStorageSync('yy1id'),
        clean_price: wx.getStorageSync('checked') ? wx.getStorageSync('checked') : '',
        service_num: wx.getStorageSync('roomType').service_num ? wx.getStorageSync('roomType').service_num : ''
      })
      if (options.fromHomeRepair == 1) {
        this.setData({
          fromHomeRepair: true,
          homeRepairShow: wx.getStorageSync('detailAll'),
          time: wx.getStorageSync('detail').activeDateAll,
          totalPrice: Number(wx.getStorageSync('detailAll').c_price) * wx.getStorageSync('detailAll').num,
        })
      } else if (options.id == 10){
        console.log(wx.getStorageSync('detailAll'));

        var detailAll = wx.getStorageSync('detailAll');
        this.setData({
          fromPeriod: true,
          name: detailAll.name,
          time: wx.getStorageSync('detail').activeDateAll,
          totalPrice: wx.getStorageSync('totalShow'),
          cmtype: detailAll.cmtype,
          fromPeriod: false,
          id: options.id,
          yy1id: detailAll.yy1_id
        })

      }else {
        if (options.period == 1) {
          this.setData({
            fromPeriod: true,
            name: wx.getStorageSync('detailAll').name,
            serTime: wx.getStorageSync('periodDetail').serTime,
            servicePeriod: wx.getStorageSync('periodDetail').servicePeriod,
            serviceHours: wx.getStorageSync('periodDetail').serviceHours,
            serviceTime: wx.getStorageSync('periodDetail').serviceTime,
            serviceFirst: wx.getStorageSync('periodDetail').serviceFirst,
            totalPrice: wx.getStorageSync('totalShow'),
            cleaner_unit: wx.getStorageSync('periodDetail').cleaner_unit,
            cleaner_price: wx.getStorageSync('periodDetail').cleaner_price,
            id: options.id
          })
        } else {
          this.setData({
            fromPeriod: false,
            name: wx.getStorageSync('detailAll').name,
            homeRepairShow: wx.getStorageSync('detailAll'),
            total_num: wx.getStorageSync('roomType') ? wx.getStorageSync('roomType').total_time : '',
            value: wx.getStorageSync('detail').value,
            time: wx.getStorageSync('detail').activeDateAll,
            totalPrice: wx.getStorageSync('totalShow'),
            id: options.id
          })
          if (wx.getStorageSync('detailAll').name == '深度清洁') {
            this.setData({
              value: wx.getStorageSync('roomType').total_time
            })
          }
        }
      }
    }
    this.setData({
      radioSelect: this.data.items[0].name
    })
    let self = this
    getApp().getDefaultAddress((data) => {
      self.setData({
        address: data,

      })
      self.data.messageData.keyword5.value = data.loca_addr + '' + data.detail_addr
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
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
    if (wx.getStorageSync('coupon')) {
      this.setData({
        totalPrice: wx.getStorageSync('totalShow') - Number(wx.getStorageSync('coupon').coupon_money)
      })
    } else {
      this.setData({
        totalPrice: this.data.totalPrice
      })
    }
    this.setData({

      couponSelect: wx.getStorageSync('coupon').coupon_money ? wx.getStorageSync('coupon').coupon_money + '元/' + wx.getStorageSync('coupon').coupon_use : this.data.couponSelect,
    })
    wx.showShareMenu({
      withShareTicket: true
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

  },

  /**
   * 用户点击右上角分享
   */

})