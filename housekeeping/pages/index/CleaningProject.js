var util = require('../../utils/util.js');
// pages/index/CleaningProject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  projectArr:[],
  activeTtitle:'',
  activeTip:'',
  activeType:'',
  inputValue:'',
    service_time:0,
    service_num:0,
    total_time:0,
    inputErr:true
  },
    /**
     * 点击切换 预约服务时间段
     */
    timeChange(e){
        console.log(e.currentTarget.dataset.type);
        this.setData({
            activeTtitle:e.currentTarget.dataset.id,
            activeTip:e.currentTarget.dataset.tip,
            activeType:e.currentTarget.dataset.type,
        })
    },
    bindinputValue: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    blurInput: function(e) {
        console.log(e.detail.value);
        var _this=this
        wx.request({
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method:'post',
            url:'https://www.zaihush.com/api/product/depth_square',
            data:{
                square_num:Number(e.detail.value),
                id:wx.getStorageSync('detailAll').id
            },
            success({data}){
                console.log('ajax data--:',data)
                if(data.status==0){
                    wx.showModal({
                        title: '错误',
                        showCancel:false,
                        content:data.err,
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                  _this.setData({
                    inputErr:true

                  })
                }else{
                  _this.setData({
                    service_time:data.res.service_time,
                    service_num:data.res.service_num,
                    total_time:data.res.total_time,
                    inputErr:false

                  })

                }

            }
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
        // this.getRoomType(options)
      this.setData({
        inputValue: wx.getStorageSync('roomType')?wx.getStorageSync('roomType').inputValue:'',
        service_num: wx.getStorageSync('roomType')?wx.getStorageSync('roomType').service_num:0,
        service_time: wx.getStorageSync('roomType')?wx.getStorageSync('roomType').service_time:0,
        total_time: wx.getStorageSync('roomType')?wx.getStorageSync('roomType').total_time:0,
        inputErr:wx.getStorageSync('roomType')?false:true
      })
  },
    /**
     * 获取类型
     */
    getRoomType(options){
        var _this=this
        wx.request({
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method:'post',
            url:'https://www.zaihush.com/api/product/syclean',
            data:{
                id:options.id,
                yy1_id:options.yy1_id,
            },
            success({data}){

                console.log('ajax data--:',data)
                _this.setData({
                    projectArr:data.res,
                    activeTtitle:wx.getStorageSync('roomType')?wx.getStorageSync('roomType').activeTtitle:data.res[0].s_id,
                    activeTip:wx.getStorageSync('roomType')?wx.getStorageSync('roomType').activeTip:data.res[0].s_tip,
                    inputValue:wx.getStorageSync('roomType')?wx.getStorageSync('roomType').inputValue:''
                })
            }
        })
    },
    setRoomType(){
      var _this=this
      // if(_this.data.inputValue!==''&&(wx.getStorageSync('roomType')&&wx.getStorageSync('roomType').inputValue)){
      //
      //   wx.navigateBack({
      //     delta: 1
      //   })
      // }else{
        if(_this.data.inputValue>0){
          // if(Number(wx.getStorageSync('detail').activeNum)>0&&Number(_this.data.service_num)<=Number(wx.getStorageSync('detail').activeNum)&&Number(_this.data.service_num)<=Number(wx.getStorageSync('detail').activeStock)){
          wx.setStorageSync('roomType', {
            activeTtitle:_this.data.activeTtitle,
            activeTip:_this.data.activeTip,
            inputValue:_this.data.inputValue,
            activeType:_this.data.activeType,
            service_num:_this.data.service_num,
            service_time:_this.data.service_time,
            total_time:_this.data.total_time,
          })
          // wx.setStorageSync('detail',{
          //     value:_this.data.inputValue
          // })
          if(_this.data.inputErr){
            wx.showModal({
              content: '请输入正确的清洁范围',
              showCancel:false,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }else {
            var totalShow =0
            if(wx.getStorageSync('detailAll').name=='新房开荒'){
              totalShow = Number(wx.getStorageSync('detailAll').sale_price)*_this.data.inputValue
            }else{
              totalShow = Number(wx.getStorageSync('detailAll').sale_price)*_this.data.total_time
            }
            wx.setStorageSync('totalShow', totalShow)

            wx.navigateBack({
              delta: 1
            })
          }
        }else{
          wx.showModal({
            content: '请输入你的保洁面积',
            showCancel:false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      // }




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