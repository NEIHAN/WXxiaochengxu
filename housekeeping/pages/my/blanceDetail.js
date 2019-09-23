var util = require('../../utils/util.js');
// pages/my/blanceDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDetail: 'rechange',
    user_id: app.globalData.userId || 1,
    rechangeList: [],
    consumeList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '明细'
    })
    this.loadRechangeDetailFn();
  },

  changeDetailFn(e) {
    var key = '';
    if (e.target) {
      key = e.target.dataset.id;
    } else {
      key = e;
    }
    this.setData({
      currentDetail: key
    })
    if(key === 'rechange'){
      this.loadRechangeDetailFn()
    }else if(key === 'consume'){
      this.loadConsumeDetailFn()
    }
  },

  loadRechangeDetailFn() {
    const self = this;
    wx.showLoading({
      mask: true,
      success(req) {
        wx.request({
          method: 'get',
          url: 'https://www.zaihush.com/api/user/get_czdetail?user_id=' + wx.getStorageSync('user_id'),
          success({ data }) {
            wx.hideLoading();
            self.filterRechangeData(data.list)
            console.log(data)
          }
        })
      },
      fail(err) {
        console.log('失败', err)
        wx.hideLoading();
      }
    })
  },
  loadConsumeDetailFn() {
    const self = this;
    wx.showLoading({
      mask: true,
      success(req) {
        wx.request({
          method: 'get',
          url: 'https://www.zaihush.com/api/user/get_xfdetail?user_id=' + wx.getStorageSync('user_id'),
          success({ data }) {
            wx.hideLoading();
            self.filterConsumeData(data.list)
            console.log(data)
          }
        })
      },
      fail(err) {
        console.log('失败', err)
        wx.hideLoading();
      }
    })
  },
  filterRechangeData(data) {
    let list = [];
    let money = 0;
    data.filter(v => {
      let time = new Date(v.rec_time);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      m = m > 9 ? m : '0' + m;
      let o = {
        date: y + '-' + m,
        times: v.rec_time,
        price: v.rec_price,
        title: '充值'
      }
      list.push(o)
    })
    this.setData({
      rechangeList: list
    })
  },
  filterConsumeData(data) {
    let list = [];
    let money = 0;
    data.filter(v => {
      let time = new Date(v.createtime);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      m = m > 9 ? m : '0' + m;
      let o = {
        date: y + '-' + m,
        times: v.createtime,
        price: v.order_total,
        title: v.title,
        ident: v.ident,
      }
      list.push(o)
    })
    this.setData({
      consumeList: list
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