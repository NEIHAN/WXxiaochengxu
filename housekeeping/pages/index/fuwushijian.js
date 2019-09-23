var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var order = ['demo1', 'demo2', 'demo3']
Page({
  // onShareAppMessage: function () {

  //   return {
  //     title: '这服务超值！',
  //     imageUrl: 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/share_new.jpg',
  //     path:'/pages/index/index?url=',
  //   }
  // },
  onShareAppMessage: util.share,
  submit() {
    console.log('will back')
    if (this.data.activeDay !== '' && this.data.activeTtitle !== '') {

      var value1 = 0
      if (this.data.options.yy1_id == 1 || this.data.options.yy1_id == 2) {
        value1 = this.data.value
        var totalShow = Number(wx.getStorageSync('checkedClean')) + Number(wx.getStorageSync('detailAll').sale_price) * value1 * this.data.peopleNum
        wx.setStorageSync('totalShow', totalShow)
      } else {
        value1 = wx.getStorageSync('roomType').inputValue;
      }
      var detail = {
        value: value1,
        peopleNum: this.data.peopleNum,
        activeDay: this.data.activeDay,
        activeDate: this.data.activeDate,
        activeDateAll: this.data.activeDateAll,
        activeTtitle: this.data.activeTtitle,
        activeNum: this.data.activeNum,
        activeStock: this.data.activeStock,
      }
      wx.setStorageSync('detail', detail)

      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showModal({
        showCancel: false,
        content: '请选择服务时间',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  data: {
    toView: 'green',
    pageQuery: null,
    serTime: null,
    serDay: null,
    options: {},
    value: Number(wx.getStorageSync('timeRange')[0]),
    peopleNum: 0,

    activeTtitle: '',
    activeDay: '',
    activeNum: 0,
    activeStock: 0,
  },
  decrease() {
    if (this.data.value > Number(wx.getStorageSync('timeRange')[0])) {
      this.setData({
        value: this.data.value -= 1
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '低于服务时间范围'
      })
    }
  },
  increase() {

    if (this.data.value < Number(wx.getStorageSync('timeRange')[1])) {
      this.setData({
        value: this.data.value += 1
      })
    } else {
      wx.showToast({
        icon: 'none',

        title: '超出服务时间范围'
      })
    }
  },
  decreasePeople() {
    if (this.data.peopleNum > Number(wx.getStorageSync('peopleRange').bomlimit)) {
      this.setData({
        peopleNum: this.data.peopleNum -= 1
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '低于服务人数范围'
      })
    }
  },
  increasePeople() {
    if (this.data.peopleNum < Number(wx.getStorageSync('peopleRange').toplimit)) {
      this.setData({
        peopleNum: this.data.peopleNum += 1
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '超出服务人数范围'
      })
    }
  },

  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e)
  },
  scroll: function(e) {
    console.log(e)
  },
  scrollToTop: function(e) {
    this.setAction({
      scrollTop: 0
    })
  },
  onShow: function() {
    // this.getDefaultAddress()
    // console.log("single show options-:",options)

  },
  tap: function(e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        })
        break
      }
    }
  },
  tapMove: function(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  /**
   * 日常保洁、夜间服务   预约服务日期
   */
  getSer_time(options) {
    var _this = this,
      params = {}

    if (options.yy1_id == 1 || options.yy1_id == 2) {
      params.c_id = options.c_id
    } else if (options.yy1_id == 0) {
      params.c_id = options.yy1_id
    } else if (options.yy1_id == 8){
      params.c_id = 0;
      params.type = "cm";
    } else {
      params.s_id = options.c_id
    }
    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'post',
      url: 'https://www.zaihush.com/api/product/ser_date',
      data: params,
      success({
        data
      }) {
        if (data.res && data.res.length) {
          data.res.forEach(item => {
            if (item.d_title) {
              item.l_title = item.d_title
            } else if (item.q_title) {
              item.l_title = item.q_title
            }
          })
        }
        _this.setData({
          serTime: data.res
        })
        if (_this.data.activeTtitle === '') {
          _this.setData({
            activeTtitle: data.res[0].l_title,
            activeDate: data.res[0].date,
          })
          if (options.yy1_id == 1 || options.yy1_id == 2) {
            _this.getSer_day({
              c_id: options.c_id,
              l_title: data.res[0].l_title
            })
          } else if (options.yy1_id == 0) {
            _this.getSer_day({
              c_id: 0,
              q_title: data.res[0].l_title
            })
          } else if (options.yy1_id == 8){
            _this.getSer_day({
              c_id: options.c_id,
              q_title: data.res[0].q_title,
              type: "cm"
            })
          }else {
            _this.getSer_day({
              s_id: options.c_id,
              d_title: data.res[0].l_title
            })
          }
        } else {
          if (options.yy1_id == 1 || options.yy1_id == 2) {
            _this.getSer_day({
              c_id: options.c_id,
              l_title: _this.data.activeTtitle
            })
          } else if (options.yy1_id == 0) {
            _this.getSer_day({
              c_id: 0,
              q_title: _this.data.activeTtitle
            })
          } else if (options.yy1_id == 8) {
            _this.getSer_day({
              c_id: options.c_id,
              q_title: _this.data.activeTtitle,
              type: "cm"
            })
          }else {
            _this.getSer_day({
              s_id: options.c_id,
              d_title: _this.data.activeTtitle
            })
          }
        }

      }
    })
  },
  /**
   * 日常保洁、夜间服务   预约服务时间段
   */
  getSer_day(options) {
    var _this = this
    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'post',
      url: 'https://www.zaihush.com/api/product/ser_time',
      data: options,
      success({
        data
      }) {
        if (data.res && data.res.length) {
          data.res.forEach(item => {
            if (item.d_time) {
              item.l_time = item.d_time
              item.l_stock = item.d_stock
              item.l_sernum = item.d_sernum
            } else if (item.q_time) {
              item.l_time = item.q_time
              item.l_stock = item.q_stock
              item.l_sernum = item.q_sernum
            }
          })
        }
        _this.setData({
          serDay: data.res
        })
        console.log('ajax data--:', _this.data.serDay)
      }
    })
  },
  /**
   * 点击切换 预约服务时间段
   */
  timeChange(e) {
    console.log(e.currentTarget.dataset.id);
    this.setData({
      activeTtitle: e.currentTarget.dataset.id,
      activeDate: e.currentTarget.dataset.date,

    })
    if (this.data.options.yy1_id == 1 || this.data.options.yy1_id == 2) {
      this.getSer_day({
        c_id: this.data.options.c_id,
        l_title: e.currentTarget.dataset.id
      })
    } else if (this.data.options.yy1_id == 0) {
      this.getSer_day({
        c_id: 0,
        q_title: e.currentTarget.dataset.id
      })

    } else if (this.data.options.yy1_id == 8){
      this.getSer_day({
        c_id: this.data.options.c_id,
        q_title: e.currentTarget.dataset.id,
        type: "cm"
      })
    } else {
      this.getSer_day({
        s_id: this.data.options.c_id,
        d_title: e.currentTarget.dataset.id
      })
    }

  },
  /**
   * 点击切换选择时间
   */
  dayChange(e) {

    if (e.currentTarget.dataset.sernum != 0 && e.currentTarget.dataset.stock != 0) {
      if (e.currentTarget.dataset.sernum < this.data.peopleNum) {
        wx.showToast({
          title: '此时间段人手不够',
          icon: 'none'
        })
      } else {
        if (wx.getStorageSync('roomType')) {
          if (Number(e.currentTarget.dataset.sernum) < Number(wx.getStorageSync('roomType').service_num)) {
            wx.showToast({
              title: '此时间段人手不够',
              icon: 'none'
            })
          } else {
            this.setData({
              activeDay: e.currentTarget.dataset.id + '/' + e.currentTarget.dataset.parentid,
              activeDateAll: e.currentTarget.dataset.parentid + '(' + this.data.activeDate + ')' + ' ' + e.currentTarget.dataset.id,

              activeNum: e.currentTarget.dataset.sernum,
              activeStock: e.currentTarget.dataset.stock,
            })
            // var value1=0
            // if(this.data.options.yy1_id==1||this.data.options.yy1_id==2){
            //     value1=this.data.value
            // }else{
            //     value1=wx.getStorageSync('roomType').inputValue;
            //
            // }
            // var detail={
            //     value:value1,
            //     activeDay:this.data.activeDay,
            //     activeTtitle:this.data.activeTtitle,
            //     activeNum:this.data.activeNum,
            //     activeStock:this.data.activeStock,
            // }
            // wx.setStorageSync('detail', detail)
          }

        } else {
          this.setData({
            activeDay: e.currentTarget.dataset.id + '/' + e.currentTarget.dataset.parentid,
            activeDateAll: e.currentTarget.dataset.parentid + '(' + this.data.activeDate + ')' + ' ' + e.currentTarget.dataset.id,
            activeNum: e.currentTarget.dataset.sernum,
            activeStock: e.currentTarget.dataset.stock,
          })
          // var value1=0
          // if(this.data.options.yy1_id==1||this.data.options.yy1_id==2){
          //     value1=this.data.value
          // }else{
          //     value1=wx.getStorageSync('roomType').inputValue;
          //
          // }
          // var detail={
          //     value:value1,
          //     activeDay:this.data.activeDay,
          //     activeDateAll:this.data.activeDateAll,
          //     activeTtitle:this.data.activeTtitle,
          //     activeNum:this.data.activeNum,
          //     activeStock:this.data.activeStock,
          // }
          // wx.setStorageSync('detail', detail)
        }
      }


    } else {
      wx.showToast({
        title: '约满啦',
        icon: 'none'
      })
    }


  },

  onLoad(options) {
    console.log(options);
    this.setData({
      options: options,
      value: wx.getStorageSync('detail') ? wx.getStorageSync('detail').value : Number(wx.getStorageSync('timeRange')[0]),
      peopleNum: wx.getStorageSync('detail') ? wx.getStorageSync('detail').peopleNum : Number(wx.getStorageSync('peopleRange').bomlimit),
      activeTtitle: wx.getStorageSync('detail') ? wx.getStorageSync('detail').activeTtitle : '',
      activeDay: wx.getStorageSync('detail') ? wx.getStorageSync('detail').activeDay : '',
      activeDate: wx.getStorageSync('detail') ? wx.getStorageSync('detail').activeDate : '',
      activeDateAll: wx.getStorageSync('detail') ? wx.getStorageSync('detail').activeDateAll : '',

    })
    this.getSer_time(options)
  }
})