var request = require('../../utils/request.js');
var util = require('../../utils/util.js');
// pages/index/SingleReservation.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    address: null,
    d: {},
    serviceTime: '请选择服务时间',
    couponSelect: '请选择优惠券',
    projectSelect: '请选择保洁项目',

    checked: false,
    activeBrand: '',
    activeType: '',
    prjNum: 1,
    tipMask: true, //购买提示框
    items: [{
      name: '',
      value: '下次不再提示',
      checked: false
    }, ],
    nameShow: '',
    suggestShow: true,
    bjType: '50',
    bjMoney: '75.0',
    dazhe: '50.0',
    yy1id: '',
    linkTo: 1,
    lumpSum: 0,
    fullReduction: 0,
    cmtype: []
  },
  timerShow() { //保洁的类型 50元
    this.setData({
      suggestShow: false
    })
  },
  check50() { //保洁的类型 60元
    this.setData({
      bjType: '50',
      bjMoney: '75.0',
      dazhe: '50.0'
    })
  },
  check60() { //建议时长
    this.setData({
      bjType: '60',
      bjMoney: '80.0',
      dazhe: '60.0'
    })
  },
  iKnow() { //建议时长 我知道了
    this.setData({
      suggestShow: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.removeStorageSync('checked') //初次进来清空缓存的清洁剂
    wx.removeStorageSync('detail') //初次进来清空缓存的时间
    wx.removeStorageSync('coupon') //初次进来清空缓存的优惠券
    wx.removeStorageSync('roomType') //初次进来清空缓存的优惠券
    wx.removeStorageSync('totalShow') //初次进来清空缓存的优惠券
    wx.removeStorageSync('checkedClean') //初次进来清空缓存的优惠券
    // wx.setStorageSync('totalShow', wx.getStorageSync('detailAll').sale_price);
    console.log('options========', options);
    console.log('options22222========', wx.getStorageSync('detailAll'));
    
    if (wx.getStorageSync('detailAll').name == "除尘除螨"){
      this.cmtype(wx.getStorageSync('detailAll').id);
    }else{
      this.getCleanTheme(options);
    }

    this.setData({
      d: options,
      nameShow: wx.getStorageSync('detailAll').name ? wx.getStorageSync('detailAll').name : wx.getStorageSync('jdqx'),

      totalShow: 0,
      totalShow0: 0,
      detailAll: wx.getStorageSync('detailAll'),
      yy1id: wx.getStorageSync('yy1id'),
    })
    // app.getAppointmentBasicInfo('/yyclean', {
    //     c_id: app.getServiceId(options.catname)
    // }, this)


  },

  /**
   * 获取除螨一般预约服务套餐
   */
  cmtype(id){
    var that = this;
    request.ajax("index.php/api/product/cmtype", {
      id:id
    }, function (data) {

      var cmt = data.res;

      for(var i=0; i<cmt.length; i++){
        cmt[i].prices = cmt[i].rd_price.split(",");
        cmt[i].quant = cmt[i].rd_bomlimit;
      }
      that.setData({
        cmtype: cmt
      });
      that.cmPrice();
    });
  },

  /**
   * 除螨价格
   */
  cmPrice(){

    var cmtype = this.data.cmtype;

    var totalShow = 0;
    var lumpSum = 0;
    var fullReduction = 0;
    for (var i = 0; i < cmtype.length; i++){

      lumpSum += cmtype[i].quant * cmtype[i].prices[0];
      totalShow += cmtype[i].quant * cmtype[i].prices[cmtype[i].quant == 0 ? 0 : cmtype[i].quant > cmtype[i].prices.length ? cmtype[i].prices.length - 1 : cmtype[i].quant - 1];
    }
    fullReduction = lumpSum - totalShow;
    fullReduction = fullReduction.toFixed(2);
    lumpSum = lumpSum.toFixed(2);
    totalShow = totalShow.toFixed(2);
    this.setData({
      totalShow: totalShow,
      lumpSum: lumpSum,
      fullReduction: fullReduction
    });

  },

  /**
   * 减
   */
  rdNum(e){
    var index = e.currentTarget.dataset.index;

    var cmtype = this.data.cmtype;
    
    if ((cmtype[index].quant - 1) >= cmtype[index].rd_bomlimit){
      cmtype[index].quant = cmtype[index].quant - 1;
      this.setData({
        cmtype: cmtype
      });
      this.cmPrice();
    }else{
      wx.showToast({
        title: '不能减少了',
        icon: 'none',
        duration: 2000
      })
    }

  },

  /**
   * 加
   */
  rdCalc(e){
    var index = e.currentTarget.dataset.index;

    var cmtype = this.data.cmtype;

    if ((cmtype[index].quant + 1) < cmtype[index].rd_toplimit) {
      cmtype[index].quant = cmtype[index].quant + 1;
      this.setData({
        cmtype: cmtype
      });
      this.cmPrice();
    } else {
      wx.showToast({
        title: '不能增加了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  checkboxChange: function(e) { //提示弹框
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  getKnow() { //提示框 我知道了
    this.setData({
      tipMask: true
    })
    if (this.data.linkTo === 2) {
      wx.navigateTo({
        url: "/pages/my/confirmOrder?id=" + this.data.d.catname + '&&fromHomeRepair=1',
      })
    } else {
      wx.navigateTo({
        url: "/pages/my/confirmOrder?id=" + this.data.d.catname,
      })
    }
  },
  decreaseNum() {

    if (this.data.prjNum > this.data.detail.c_bomlimit) {
      var decreNum = this.data.prjNum - 1
      this.setData({
        prjNum: decreNum,
        totalShow0: Number(this.data.detail.c_zprice) * decreNum
      })
    }
  },
  increaseNum() {
    if (this.data.prjNum < this.data.topLimit) {
      var increNum = this.data.prjNum + 1
      this.setData({
        prjNum: increNum,
        totalShow0: Number(this.data.detail.c_zprice) * increNum
      })
    }

  },
  selectBrand(e) {
    this.setData({
      activeBrand: e.currentTarget.dataset.name
    })
  },
  selectType(e) {
    this.setData({
      activeType: e.currentTarget.dataset.name
    })
  },
  /**
   * 日常保洁、夜间服务   一般预约
   */
  getCleanTheme(options) {
    //区分一般预约，周期预约
    var _this = this
    let params = {
      id: options.catname,
    }
    if (options.yy1_id && options.yy1_id == 0) {
      wx.request({
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: 'post',
        url: 'https://www.zaihush.com/api/product/jdqxtype',
        data: params,
        success({
          data
        }) {
          _this.setData({
            detail: data.res,
            prjNum: data.res.c_bomlimit,
            activeBrand: data.res.c_brand[0],
            activeType: data.res.c_type[0],
            topLimit: data.res.c_toplimit,
            totalShow0: Number(data.res.c_zprice) * data.res.c_bomlimit
          })
          console.log('ajax data--:', data)
        }
      })

    } else {
      if (options.yy1_id && options.yy1_id == 1 || options.yy1_id == 2) {
        params.yy1_id = options.yy1_id
      }
      var url;
      url = options.yy1_id == 1 || options.yy1_id == 2 ? 'sclean' : 'syclean'
      wx.request({
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: 'post',
        url: 'https://www.zaihush.com/api/product/' + url,
        data: params,
        success({
          data
        }) {
          if (options.yy1_id == 1 || options.yy1_id == 2) {
            _this.setData({
              detail: data.res
            })
            wx.setStorageSync('timeRange', data.res.c_timelong);
            let peopleRange = {
              bomlimit: data.res.bomlimit,
              toplimit: data.res.toplimit
            }
            wx.setStorageSync('peopleRange', peopleRange);
          } else {
            _this.setData({
              detail: data.res[0]
            })
          }
          console.log('ajax data--:', _this.data.detail)
        }
      })
    }

  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  getDefaultAddress() {
    let self = this
    app.getDefaultAddress((data) => {
      self.setData({

        address: data
      })

      console.log('reveived get default address data in show--:', data)
    })
  },
  serviceValChange(e) {
    var totalChange = 0
    totalChange = this.data.detail.cleaner_price ? Number(this.data.detail.cleaner_price) : 0

    if (e.detail.value.length) {
      this.setData({
        checked: true,
        totalShow: Number(wx.getStorageSync('totalShow')) + totalChange
      })
      wx.setStorageSync('checkedClean', totalChange)
    } else {
      this.setData({
        checked: false,
        totalShow: Number(wx.getStorageSync('totalShow')) - totalChange
      })
      wx.setStorageSync('checkedClean', 0)

    }
    wx.setStorageSync('totalShow', this.data.totalShow);
  },
  /**
   * 购买
   */
  buy() {
    var _this = this;
    // _this.setData({//温馨提示弹框
    //   tipMask: false
    // })
    if (_this.data.d.yy1_id == 1 || _this.data.d.yy1_id == 2) {
      if (this.data.address && _this.data.address.addr_id && wx.getStorageSync('detail')) {
        //计算总价
        var totalPrice = Number(wx.getStorageSync('detailAll').sale_price)
        if (_this.data.checked) {
          wx.setStorageSync('checked',
            _this.data.detail.cleaner_price + "元/" + _this.data.detail.cleaner_unit
          );
          totalPrice = wx.getStorageSync('detail').peopleNum * totalPrice * wx.getStorageSync('detail').value + Number(_this.data.detail.cleaner_price)
        } else {
          totalPrice = wx.getStorageSync('detail').peopleNum * totalPrice * Number(wx.getStorageSync('detail').value)
        }
        if (wx.getStorageSync('coupon')) {
          totalPrice -= Number(wx.getStorageSync('coupon').coupon_money)
        }
        wx.setStorageSync('totalPrice', totalPrice);
        wx.setStorageSync('totalShow', totalPrice);
        _this.setData({
          linkTo: 1,
          tipMask: false
        })
        // wx.navigateTo({
        //     url: "/pages/my/confirmOrder?id="+_this.data.d.catname,
        // })

      } else {
        wx.showModal({
          content: '请选择服务时间，还有您的地址',
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
    } else if (_this.data.d.yy1_id == 0) {
      if (_this.data.address && _this.data.address.addr_id && wx.getStorageSync('detail')) {
        let obj = wx.getStorageSync('detailAll')
        obj.type = _this.data.activeType
        obj.brand = _this.data.activeBrand
        obj.num = _this.data.prjNum
        obj.c_price = _this.data.detail.c_zprice
        wx.setStorageSync('detailAll', obj)
        wx.setStorageSync('totalShow', _this.data.totalShow0)
        _this.setData({
          linkTo: 2,
          tipMask: false
        })

      } else {
        wx.showModal({
          content: '请选择服务时间，还有您的地址',
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

    } else if (_this.data.d.yy1_id == 8) {

      if (_this.data.totalShow < 180){
        wx.showToast({
          title: '金额要到180元才可提交哦',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if (_this.data.address && _this.data.address.addr_id && wx.getStorageSync('detail')) {
        let obj = wx.getStorageSync('detailAll');

        var cmtype = this.data.cmtype;
        var cmty = [];
        for (var i = 0; i < cmtype.length; i++) {
          
          if (cmtype[i].quant > 0){
            cmty[cmty.length] = cmtype[i];
          }
        }
        obj.cmtype = cmty;
        wx.setStorageSync('detailAll', obj)
        wx.setStorageSync('totalShow', _this.data.totalShow)

        wx.navigateTo({
          url: "/pages/my/confirmOrder?id=" + this.data.d.catname,
        })

      } else {
        wx.showModal({
          content: '请选择服务时间，还有您的地址',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }

    } else {
      if (_this.data.address && _this.data.address.addr_id && wx.getStorageSync('detail') && wx.getStorageSync('roomType')) {
        //计算总价
        var totalPrice = Number(wx.getStorageSync('detailAll').sale_price)

        totalPrice = totalPrice * Number(wx.getStorageSync('roomType').inputValue)
        if (wx.getStorageSync('coupon')) {
          totalPrice -= Number(wx.getStorageSync('coupon').coupon_money)
        }
        wx.setStorageSync('totalPrice', totalPrice)

        _this.setData({
          linkTo: 3,
          tipMask: false
        })

      } else {
        wx.showModal({
          content: '请选择服务时间，保洁项目，还有您的地址',
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
    }


  },
  /**
   * 跳转到选择项目
   * */
  goCleaningPrj(e) {
    // if(this.data.serviceTime=='请选择服务时间'){
    //     wx.showModal({
    //         content: '请选择服务时间',
    //         showCancel:false,
    //         success: function(res) {
    //             if (res.confirm) {
    //                 console.log('用户点击确定')
    //             } else if (res.cancel) {
    //                 console.log('用户点击取消')
    //             }
    //         }
    //     })
    // }else{
    wx.navigateTo({
      url: "/pages/index/CleaningProject?id=" + e.currentTarget.dataset.id + '&&yy1_id=' + e.currentTarget.dataset.yyid,
    })
    // }

  },
  gofuwushijian(e) {
    console.log(e);
    if ((this.data.d.yy1_id == 3 || this.data.d.yy1_id == 5 || this.data.d.yy1_id == 4) && this.data.projectSelect == '请选择保洁项目') {
      wx.showModal({
        content: '请选择保洁项目',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: "/pages/index/fuwushijian?c_id=" + e.currentTarget.dataset.cid + '&&yy1_id=' + e.currentTarget.dataset.yyid,
      })
    }
  },
  suggestFn() { //建议时长 我知道了
    this.setData({
      suggestShow: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getDefaultAddress()
    wx.removeStorageSync('coupon')
    console.log(wx.getStorageSync('roomType'))
    // if(this.data.checked){
    //
    // }
    this.setData({
      serviceTime: wx.getStorageSync('detail') ? wx.getStorageSync('detail').activeDateAll : '请选择服务时间',
      projectSelect: wx.getStorageSync('roomType') ? wx.getStorageSync('roomType').inputValue + '平米 / ' + wx.getStorageSync('roomType').service_time + '小时 x ' + wx.getStorageSync('roomType').service_num + '人' : '请选择保洁项目',
      couponSelect: wx.getStorageSync('coupon') ? '￥' + wx.getStorageSync('coupon').coupon_money + '/' + wx.getStorageSync('coupon').coupon_use : '请选择优惠券',
      totalShow: wx.getStorageSync('totalShow') ? wx.getStorageSync('totalShow') : this.data.totalShow,
      valueTime: wx.getStorageSync('detail') ? ' / ' + wx.getStorageSync('detail').value + '小时 x ' : '',
      peopleNum: wx.getStorageSync('detail') ? wx.getStorageSync('detail').peopleNum + '人' : '',
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
  // onShareAppMessage: function () {

  // }
  onShareAppMessage: util.share,
})