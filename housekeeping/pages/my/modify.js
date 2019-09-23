var util = require('../../utils/util.js');
// pages/my/modify.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: '',
    detail_addr: '',
    linkman: '',
    contact_num: '',
    square: '',
    isDefault: 0,
    user_id: '',
    addr_id: ''
  },

  submitAddr() {
    const self = this.data;
    const data = {
      user_id: self.user_id,
      addr_id: self.addr_id,
      linkman: self.linkman,
      loca_addr: self.position,
      detail_addr: self.detail_addr,
      contact_num: self.contact_num,
      square_num: self.square,
      is_default: self.isDefault
    }
    wx.showLoading({
      mask: true,
      success(req) {
        wx.request({
          method: 'POST',
          header: { "content-type": "application/x-www-form-urlencoded" },
          url: 'https://www.zaihush.com/api/address/edit_adds',
          data: data,
          success({ data }) {
            wx.hideLoading();
            if (data.status === 1) {
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              })
                wx.navigateBack({
                    delta: 1
                })
            } else {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          }
        })
      },
      fail(err) {
        console.log('失败', err)
        wx.hideLoading();
      }
    })
  },

  positionFn(e) {
    this.setData({
      position: e.detail.value
    })
  },
  detailAddrFn(e) {
    this.setData({
      detail_addr: e.detail.value
    })
  },
  linkmanFn(e) {
    this.setData({
      linkman: e.detail.value
    })
  },
  contactNumFn(e) {
    this.setData({
      contact_num: e.detail.value
    })
  },
  squareFn(e) {
    this.setData({
      square: e.detail.value
    })
  },
  isDefaultFn(e) {
    this.setData({
      isDefault: e.detail.value.length
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    console.log(options)
    var addr_id = options.addr_id;
    this.setData({
      user_id: app.globalData.userId,
      addr_id: options.addr_id,
    })
    wx.request({
      method: 'get',
      url: 'https://www.zaihush.com/api/address/details/?addr_id=' + addr_id+'&user_id='+self.data.user_id,
      success({data}) {
        console.log(data)
        if(data.status===1){
          self.setData({
            position: data.arr.loca_addr||'123123',
            detail_addr: data.arr.detail_addr,
            linkman: data.arr.linkman,
            contact_num: data.arr.contact_num,
            square: data.arr.square_num,
            isDefault: data.arr.is_default,
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