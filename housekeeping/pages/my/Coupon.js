var util = require('../../utils/util.js');
// pages/my/Coupon.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon: {},
    fromConfirmOrder:'',
    curretCoupon: [],
    showModel: false,
    authCode: '',
    cdkey: '',
    user_id: app.globalData.userId || 1
  },
  buy() {
    this.setData({
      showModel: true
    })
  },
  getCoupon(){
    const self = this;
    wx.setNavigationBarTitle({
      title: '优惠券'
    })
    wx.request({
      method: 'get',
      url: 'https://www.zaihush.com/api/user/voucher?user_id='+wx.getStorageSync('user_id'),
      success({ data }) {
        self.setData({
          coupon:data
        })
        self.changeCouponFn('nouses');
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.fromConfirmOrder){
      this.setData({
        fromConfirmOrder:options.fromConfirmOrder
      })
    }
    this.getCoupon()
  },

    /**
     * 选择优惠券 coupon_use_price
     */

    selectCoupon(e){
      console.log(e.currentTarget.dataset.coupon);
      if(e.currentTarget.dataset.coupon.status==1){

        if(this.data.fromConfirmOrder==1){
          var proid = Number(wx.getStorageSync('detailAll').id)>6?'7':wx.getStorageSync('detailAll').id+''
          if((e.currentTarget.dataset.coupon.pro_id[0]==0||e.currentTarget.dataset.coupon.pro_id.indexOf(proid)>-1)&&Number(e.currentTarget.dataset.coupon.coupon_use_price)<=wx.getStorageSync('totalShow')){
            wx.setStorageSync('coupon', e.currentTarget.dataset.coupon)
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '不可用',
              icon:'none'
            })
          }

        }else if(this.data.fromConfirmOrder==2){//活动
          if(e.currentTarget.dataset.coupon.pro_id[0]==500&&Number(e.currentTarget.dataset.coupon.coupon_use_price)<=wx.getStorageSync('totalShow')){
            wx.setStorageSync('coupon', e.currentTarget.dataset.coupon)
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '不可用',
              icon:'none'
            })
          }

        }
      }else{
        wx.showToast({
          title: '不可用',
          icon:'none'
        })
      }


    },
  changeData (key) {
    const _self = this.data;
    for(let i in _self.coupon){
      let v = _self.coupon[i];
      if (typeof v === 'object'&&v.length){
        v.filter(k => {
          if(k.start_time&& k.end_time){
              k.start_time =k.start_time.split(' ')[0];
              k.end_time = k.end_time.split(' ')[0];
          }
        })
      }
    }
    this.setData({
      currentCoupon: _self.coupon[key]
    })
  },

  changeCouponFn (e) {
      console.log(e);
    var key = '';
    if(e.target){
      key = e.target.dataset.id;
    }else{
      key = e;
    }
    this.changeData(key);
    this.setData({
      currentId: key
    })
  },
  
  showModelFn() {
    this.setData({
      showModel: true
    })
  },

  hideModelFn() {
    this.setData({
      showModel: false
    })
    this.setData({
      authCode: '',
      cdkey: ''
    })
    console.log(this.data.authCode, this.data.cdkey)
  },

  confirmExchange() {
    const self = this;
    wx.request({
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      url: 'https://www.zaihush.com/api/user/exchange',
      data: {
        user_id: self.data.user_id,
        exchange: self.data.cdkey
      },
      success({ data }) {
        console.log(data)
        let err=''
        if(data.status==1){
          err=data.res
        }else{
          err=data.err

        }
        wx.showToast({
          title: err,
          icon: 'none'
        })
        self.setData({
          showModel: false
        })
        self.getCoupon()

      }
    })
  },

  authCodeFn(e) {
    this.setData({
      authCode: e.detail.value
    })
  },

  cdkeyFn(e) {
    this.setData({
      cdkey: e.detail.value
    })
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