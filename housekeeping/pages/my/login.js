var util = require('../../utils/util.js');
// pages/my/login.js
const app = getApp();
var interval = null; //倒计时函数
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
   * 组件的属性列表
   */
  properties: {

  },


  /**
   * 组件的初始数据
   */
  data: {
    iphoneVal:'',//手机号
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 60,
    code: '',
    user_id: '',
    inputCode: '',
    checked:false
  },
  gotextLong(){
    wx.navigateTo({
      url: '/pages/my/userPro'
    })
  },
    onHide: function() {
        wx.showTabBar({
            animation:true,
        })
    },
  onLoad: function() {
    const self = this;
    this.data.user_id = app.globalData.userId;
  },
  /**
   * 组件的方法列表
   */
  iphoneValue(e){
    this.setData({
        iphoneVal:e.detail.value
    })
    // this.data.iphoneVal=e.detail.value;//输入的手机号
    
  },
  getCode: function (options) {
    var that = this;
    this.setData({
      disabled: true
    })
    var currentTime = that.data.currentTime;
    wx.request({
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      url: 'https://www.zaihush.com/api/user/user_vercode',
      data:{
        user_id: that.data.user_id,
        mobile: that.data.iphoneVal
      },
      success: function (res) {
        console.log(res.data.err)
        wx.showToast({
          title: res.data.err,
          icon: 'none',
          duration: 1500
        })
      }
    })
    interval = setInterval(function () {//60秒倒计时
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode(IF_GET_CODE=true) {
    
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]))+\d{8})$/;
    if (this.data.iphoneVal.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (this.data.iphoneVal.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(this.data.iphoneVal)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    else{
      if(IF_GET_CODE){
          this.getCode();
      }else{
        return true
      }
    }
    return true
    // else {//手机号填写正确
    //
    //
    // }

      // getVerificationCode
    
  },
  loginFn(){//登录

    if(!this.getVerificationCode(false)){
      return false;
    }

    if((''+this.data.inputCode||'').trim()==''){
        wx.showToast({
            title: '验证码不能为空',
            icon: 'none',
            duration: 1500
        })
      return false
    }


    const self = this;
    wx.showLoading({
      success() {
        wx.request({
          method: 'post',
          header: { "content-type": "application/x-www-form-urlencoded" },
          url: 'https://www.zaihush.com/api/user/user_mobile',
          data: {
            user_id: self.data.user_id,
            mobile: self.data.iphoneVal,
            code: self.data.inputCode
          },
          success(req) {
            console.log(req)
            console.log(self)

              if(req.data.err){
                  wx.showToast({
                      title: req.data.err,
                      icon: 'none',
                      duration: 1500

                  })
                return false
                  wx.hideLoading()
              }

            var data = '';
            try{
              data = req.data.res

                if(data){
                    let user_id = data.user_id;
                    let mobile = data.mobile;
                    let mobile_validated = data.mobile_validated;

                    wx.setStorageSync('user_id', user_id);
                    wx.setStorageSync('mobile', mobile);
                    wx.setStorageSync('avatar', data.avatar);
                    wx.request({
                        header: {
                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        method:'post',
                        url:'https://www.zaihush.com/api/index/new_user',
                        data:{
                            user_id:user_id
                        },
                        success({data}){
                            // wx.showToast({
                            //     title: '绑定成功',
                            //     icon: 'none',
                            //     duration: 1500
                            //
                            // })
                            wx.showModal({
                                title: '',
                                content: data.err,
                                showCancel:false,
                                success: function(res) {
                                    console.log(res);
                                    if (res.confirm) {

                                        app.globalData.hasLogin=true
                                        wx.navigateBack({
                                            delta: 2
                                        })
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            })
                        }
                    })
                    // wx.setStorageSync('mobile_validated', mobile_validated)

                }
                wx.hideLoading()
            }catch(e){
              console.warn('e--:',e)
                wx.showToast({
                    title: '系统繁忙请稍后再试',
                    icon: 'none',
                    duration: 1500

                })
                wx.hideLoading()

            }


          }
        })
      }
    })
  },
  serviceValChange(e){
    if(e.detail.value.length){
      this.setData({
        checked:true,
      })
    }else{
      this.setData({
        checked:false,
      })
    }
  },
  inputCodeFn(e) {
    this.setData({
        inputCode:e.detail.value
    })
    // this.data.inputCode = e.detail.value;
  }
  
})
