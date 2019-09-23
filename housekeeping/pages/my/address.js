var util = require('../../utils/util.js');
// pages/my/address.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adds: [],
    user_id: '',
    myUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.myUrl = options.url || '';
  },

  linkModifyFn(item) {
    console.log(item)
  },

  deleteAddr(e) {
    const self = this;
    wx.showModal({
      title: '删除',
      content: '确定删除该地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true,
            success(req) {
              wx.request({
                method: 'post',
                header: { "content-type": "application/x-www-form-urlencoded" },
                url: 'https://www.zaihush.com/api/address/del_adds',
                data: {
                  // addr_id: Number(e.target.dataset.id.split('-')[1]),
                    addr_id: Number(e.currentTarget.dataset.id),

                    user_id: self.data.user_id
                },
                success({ data }) {
                  var title = '';
                  if (data.status === 1) {
                    title = '删除成功';
                  } else {
                    title = '删除失败'
                  }
                  wx.hideLoading();
                  wx.showToast({
                    title: title,
                    icon: 'none'
                  })
                  self.onShow();
                }
              })
            },
            fail(err) {
              console.log('失败', err)
              wx.hideLoading();
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  setDefaultAddr(e) {
        const self = this;
        wx.showLoading({
            mask: true,})
        //     success(req) {
                wx.request({
                    method: 'post',
                    header: { "content-type": "application/x-www-form-urlencoded" },
                    url: 'https://www.zaihush.com/api/address/set_default',
                    data: {
                        user_id: self.data.user_id,
                        // addr_id: Number(e.currentTarget.dataset.id.split('-')[1])
                        addr_id: Number(e.currentTarget.dataset.id)
                    },
                    success({ data }) {
                        console.log(data)
                        let title = '';
                        if(data.status === 1){
                            title = '设置成功';
                            console.log(self.data.myUrl)
                            if(!self.data.myUrl){
                              wx.navigateBack({
                                delta: 1
                              })
                            }
                        }else{
                            title = '设置失败'
                        }
                        wx.hideLoading();
                        wx.showToast({
                            title: title,
                            icon: 'none'
                        })
                        self.onShow();
                    }
                })
            // },
            // fail(err) {
            //     console.log('失败',err)
            //     wx.hideLoading();
            // }
        // })
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
      const self = this;
      console.log('address-----------',this)
      self.data.user_id = app.globalData.userId || 1
      wx.request({
          method: 'get',
          url: 'https://www.zaihush.com/api/address/index?user_id=' + self.data.user_id,
          success({data}){
              self.setData({
                  adds: data.adds
              })
          }
      })
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

  globalData: {

  }
})