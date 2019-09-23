var util = require('../../utils/util.js');
// pages/index/PeriodicReservation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    detail:{},
    responseData:{},
    activePeriod:'',
      d_serlong1:'',
      d_serlong2:'',
      d_sertime1:'',
      d_sertime2:'',
       serTime:0,
       serLong:0,
      value:[0,0],
      condition:false,
    firstDate:false,
      weekActive:'',
      hourActive:'',
      firstService:'',
    cleaner_price:'',
    cleaner_unit:'',
      firstServiceValue:'',
    firstServiceArr:[],
    slideTime:false,
    slideDate:false,
    address:{},
    suggestShow: true,
      serPeople:1,
      times:1,
      total:0,
      valiated:true,

  },
  suggestFn() {//建议时长 我知道了
    this.setData({
      suggestShow: false
    })
  },
  iKnow() {//建议时长 我知道了
    this.setData({
      suggestShow: true
    })
  },
    firstServiceChange(e){
      const val = e.detail.value
        console.log(e);
      var _this=this
      if(_this.data.firstServiceArr[val[0]].l_stock==0||_this.data.firstServiceArr[val[0]].l_sernum==0){
        wx.showToast({
          icon:'none',
          title: '预约已满',
        })
          this.setData({
              valiated:false
          })
      }else{
        if(_this.data.firstServiceArr[val[0]].l_sernum<_this.data.serPeople){
            wx.showToast({
                icon:'none',
                title: '此时间段人手不够~',
            })
            this.setData({
                valiated:false
            })
        }else{
            this.setData({
                slideDate:true,
                valiated:true,
                firstService:_this.data.firstServiceArr[val[0]].l_title,
            })
        }

      }
    },
  sureFirstDate(){
      let _this=this
        if(!_this.data.slideDate){

          if(_this.data.firstServiceArr[0].l_stock==0||_this.data.firstServiceArr[0].l_sernum==0){
            wx.showToast({
              icon:'none',
              title: '预约已满',
            })
          }else{
            if(_this.data.firstServiceArr[0].l_sernum<_this.data.serPeople){
                  wx.showToast({
                    icon:'none',
                    title: '此时间段人手不够~',
                  })
            }else{
              _this.setData({
                firstService:this.data.firstServiceArr[0].l_title,
              })
              _this.setData({
                firstDate:false
              })
              wx.setStorageSync('periodNum', this.data.serPeople);
            }
          }

        }else{
          if(_this.data.valiated){
            _this.setData({
              firstDate:false
            })
            wx.setStorageSync('periodNum', this.data.serPeople);
          }
        }





  },
    bindChange(e){
        const val = e.detail.value
        var _this=this
        this.setData({
          slideTime:true,
          firstService:'',
            weekActive:_this.data.responseData.d_yytitle[val[0]],
            hourActive:_this.data.responseData.d_yytime[val[1]],
        })
    },
  closeFirstDate(){
    this.setData({
      firstDate:false,
      firstService:''
    })
  },

    closeTime(){
        this.setData({
            condition:false,
          weekActive:'',
          hourActive:'',
          firstService:'',
        })
    },
    sureTime(){
      if(!this.data.slideTime){
        this.setData({
          weekActive:this.data.responseData.d_yytitle[0],
          hourActive:this.data.responseData.d_yytime[0],
        })
      }
        this.setData({
            condition:false
        })
    },
    openTimePeriod(){
      this.setData({
          condition:true,
        slideTime:false,
      })
    },
    selectServiceType(e){
      this.setData({
          activePeriod:e.currentTarget.dataset.name,
        value:[0,0],
        condition:false,
        firstDate:false,
        weekActive:'',
        hourActive:'',
        firstService:'',
        firstServiceValue:'',
        firstServiceArr:[],
        slideTime:false,
        slideDate:false,
      })

        if(e.currentTarget.dataset.name=='两周一次'){
            this.setData({
                times:1/2
            })
        }else{
            this.setData({
                times:1
            })
        }
      this.getDetail(this.data.options)
    },
    decreasePeople(){
        if(this.data.serPeople>this.data.responseData.bomlimit){
        var peopleCalc = this.data.serPeople-=1
            this.setData({
                serPeople:peopleCalc,
                total:Number(this.data.responseData.sale_price)*this.data.times*Number(this.data.serTime)*Number(this.data.serLong)*Number(peopleCalc)
            })
        }else{
            wx.showToast({
              icon:'none',
                title: '低于当前服务人数'
            })
        }
    },
    increasePeople(){
        if(this.data.serPeople<this.data.responseData.toplimit){
        var peopleCalc = this.data.serPeople+=1

        this.setData({
                serPeople:peopleCalc,
                total:Number(this.data.responseData.sale_price)*this.data.times*Number(this.data.serTime)*Number(this.data.serLong)*Number(peopleCalc)

            })
        }else{
            wx.showToast({
              icon:'none',
              title: '超出服务人数范围'
            })
        }
    },
    decreaseTime(){
        if(this.data.serTime>this.data.d_sertime1){
            var peopleCalc = this.data.serTime-=1

            this.setData({
                serTime:peopleCalc,
                // total:Number(this.data.responseData.sale_price)*this.data.times*Number(this.data.serTime)*Number(this.data.serLong)*Number(this.data.serPeople)
                total:Number(this.data.responseData.sale_price)*this.data.times*Number(peopleCalc)*Number(this.data.serLong)*Number(this.data.serPeople)
            })
        }else{
            wx.showToast({
                icon:'none',
                title: '低于服务时间范围'
            })
        }
    },
    increaseTime(){
        if(this.data.serTime<this.data.d_sertime2){
            var peopleCalc = this.data.serTime+=1

            this.setData({
                serTime:peopleCalc,
                total:Number(this.data.responseData.sale_price)*this.data.times*Number(peopleCalc)*Number(this.data.serLong)*Number(this.data.serPeople)

            })
        }else{
            wx.showToast({
                icon:'none',
                title: '超出服务时间范围'
            })
        }
    },
    decreaseLong(){
        if(this.data.serLong>this.data.d_serlong1){
            var peopleCalc = this.data.serLong-=1

            this.setData({
                serLong:peopleCalc,
                total:Number(this.data.responseData.sale_price)*this.data.times*Number(this.data.serTime)*Number(peopleCalc)*Number(this.data.serPeople)

            })
        }else{
            wx.showToast({
                icon:'none',
                title: '低于服务时间范围'
            })
        }
    },
    increaseLong(){
        if(this.data.serLong<this.data.d_serlong2){
            var peopleCalc = this.data.serLong+=1

            this.setData({
                serLong:peopleCalc,
                total:Number(this.data.responseData.sale_price)*this.data.times*Number(this.data.serTime)*Number(peopleCalc)*Number(this.data.serPeople)
            })
        }else{
            wx.showToast({
                icon:'none',
                title: '超出服务时间范围'
            })
        }
    },
  openFirstDate(){
      if(this.data.hourActive!==''){
        var _this=this
        this.setData({
          firstDate:true,
          slideDate:false,
        })
        wx.request({
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          method:'post',
          url:'https://www.zaihush.com/api/product/ser_zqtime',
          data:{
            c_id:_this.data.options.catname,
            l_time:_this.data.hourActive,
            l_date:_this.data.weekActive,
          },
          success({data}){
            console.log('ajax data--:',data)
            data.res.forEach(item=>{
              item.l_title = item.l_title+' ('+item.date+')'

            })
            _this.setData({
              firstServiceArr:data.res
            })

          }

        })
      }else{

        wx.showToast({
          icon:'none',
          title: '请选择周期服务时间',
        })
      }

  },
  goPeriodPay(){
    var _this=this
    var total = 0
    if(_this.data.activePeriod=='一周一次'){
      total=Number(_this.data.serTime)*Number(wx.getStorageSync('detailAll').sale_price)*Number(_this.data.serLong)
    }else if(_this.data.activePeriod=='两周一次'){
      total=Math.ceil(_this.data.serTime/2)*Number(wx.getStorageSync('detailAll').sale_price)*_this.data.serLong

    }
    var periodDetail={
      serTime:_this.data.serTime,
      servicePeriod:_this.data.activePeriod,
      serviceHours:_this.data.serLong,
      serviceTime:_this.data.weekActive+'/'+_this.data.hourActive,
      serviceFirst:_this.data.firstService,
      cleaner_unit:_this.data.cleaner_unit,
      cleaner_price:_this.data.cleaner_price,
      total:total
    }
    if(_this.data.weekActive!==''&&_this.data.firstService!==''){
      wx.setStorageSync('periodDetail', periodDetail);
      wx.setStorageSync('totalShow', _this.data.total)
      wx.navigateTo({
        url: "/pages/my/confirmOrder?id="+_this.data.options.catname+'&&period=1',
      })
    }else{
      wx.showToast({
        icon:'none',
        title: '请选择周期服务时间,第一次服务时间',
      })
    }

  },
  getDefaultAddress() {
    let self=this
    getApp().getDefaultAddress((data) =>{
      self.setData({

        address: data
      })

      console.log('reveived get default address data in show--:', data)
    })
  },
  getDetail(options){
    var _this=this
    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method:'post',
      url:'https://www.zaihush.com/api/product/cyclean',
      data:{
        id:options.catname,
        yy2_id:options.yy2_id,
      },
      success({data}){
        console.log('ajax data--:',data)
        _this.setData({
          responseData:data.res,
          serTime:data.res.d_sertime1,
          serLong:data.res.d_serlong1,
          serPeople:data.res.bomlimit,
          d_serlong1:data.res.d_serlong1,
          d_serlong2:data.res.d_serlong2,
          d_sertime1:data.res.d_sertime1,
          d_sertime2:data.res.d_sertime2,
          cleaner_price:data.res.cleaner_price,
          cleaner_unit:data.res.cleaner_unit,
        })
        if(_this.data.activePeriod==''){
          _this.setData({
            activePeriod:data.res.d_frequency[0],

          })
        }

          _this.setData({
              total:Number(_this.data.responseData.sale_price)*_this.data.times*Number(_this.data.serTime)*Number(_this.data.serLong)*Number(_this.data.serPeople)
          })

      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.setData({
      options:options,
      detail:wx.getStorageSync('detailAll')
    })
    this.getDetail(options)
  wx.removeStorageSync('periodDetail')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDefaultAddress()
    wx.removeStorageSync('coupon')

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
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