var util = require('../../utils/util.js');
// pages/my/evaluate.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked: 'manyi',
    pingjiaContent: '',
    starHtml: [],
    star: 0,
    id: '',
    order_id: '',
    orderDetail:{},
    messageData:{
      "keyword1": {
        "value": "339208499"
      },
      "keyword2": {
        "value": "2015年01月05日 12:30"
      },
      "keyword3": {
        "value": "粤海喜来登酒店"
      } ,
      "keyword4": {
        "value": "点击反馈您的下单体验, 将帮助我们更好提升服务质量。评价后48小时内派送8元无门槛优惠券"
      },
      "keyword5": {
        "value": "0754-8992694"
      },

    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      order_id: options.order_id
    })
    this.data.messageData.keyword1.value= options.order_id
    let self=this
    wx.request({
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      url: 'https://www.zaihush.com/api/order/order_details',
      data: {
        order_id: options.order_id
      },
      success({ data }) {
        if(data.status == 1){
          self.setData({
            orderDetail: data.ord,

          })
          self.data.messageData.keyword2.value= data.ord.service_date+' '+data.ord.service_time
          self.data.messageData.keyword3.value= data.ord.service_items

        }
        console.log('order-detail------',data)
      }
    })
  },

  checkManyidu(e) {
    console.log(e.target.dataset.id)
    this.setData({
      isChecked: e.target.dataset.id
    })
  },

  checkPinjiaNeirong(e) {
    let newText = e.target.dataset.text;
    let oldText = this.data.pingjiaContent;
    let textArr = oldText.split(' ');
    console.log(newText, oldText)
    if(textArr.indexOf(newText) > -1){
      this.setData({
        pingjiaContent: oldText
      })
    }else{
      this.setData({
        pingjiaContent: oldText ? (oldText + ' ' + newText) : newText
      })
    }
    
    console.log(e.target.dataset.text)
  },

  pingjiaCotentFn(e) {
    this.setData({
      pingjiaContent: e.detail.value
    })
  },

  checkStar(e) {
    this.setData({
      star: e.target.dataset.val
    })
    let star = e.target.dataset.val;
    let arr = [];
    let url = 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/no-star.png';
    for(let i=1; i<6; i++){
      if(i<=star){
        url = 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/full-star.png';
      }else{
        url = 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/no-star.png';
      }
      arr.push(url)
    }
    this.setData({
      starHtml: arr
    })
  },

  submitPingjia(e) {
    let data = this.data;
    let id = data.id;
    let order_id = data.order_id;
    let myd = '';
    if(data.isChecked === 'bumanyi'){
      myd = '3'
    } else if (data.isChecked === 'yiban'){
      myd = '2'
    } else if (data.isChecked === 'manyi') {
      myd = '1'
    }
    let content = data.pingjiaContent;
    console.log(content);
    let star = data.star;
    wx.request({
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded" },
      url: 'https://www.zaihush.com/api/order/addmessage',
      data: {
        id: id, // 订单编号
        order_id: order_id, // 订单号
        myd: myd, // 满意度
        content: content, // 评价内容
        star: star // 星级
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.status == 1){
          wx.showToast({
            title: '评价成功',
            icon: 'none'
          })
          app.evaluateOrder(e.detail.formId,data.messageData)

          wx.reLaunch({
            url:  "/pages/my/myorder?selected5=1",
          })
        }else{
          wx.showToast({
            title: '评价失败',
            icon: 'none'
          })
        }
      }
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
    let o={
      target: {
        dataset: {
          val: 0
        }
      }
    }
    this.checkStar(o);
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