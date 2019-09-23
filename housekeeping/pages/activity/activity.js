Page({
  onShareAppMessage: function () {

    return {
      title: '这服务超值！',
      imageUrl: 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/share_new.jpg',
      path:'/pages/index/index?url=',
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
  act_list:[],
    bg_img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options=====',options);
    wx.setStorageSync('activity_id', options.activity_id);
    this.getActivity(options.activity_id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
//跳转活动xiangqing页面
  goActivityDetail(e){
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail?act_item_id='+e.currentTarget.dataset.id
    })
    wx.setStorageSync('act_item_id', e.currentTarget.dataset.id);

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    wx.removeStorageSync('activityAll')
  },

//获取活动
  getActivity:function (id) {
    console.log('id=====',id);
    let _this=this
    wx.request({
      method:'get',
      url:'https://www.zaihush.com/index.php/api/activity/index',
      data:{
        activity_id:id
      },
      success(res){
        console.log('活动--------',res);
        _this.setData({
          act_list:res.data.act,
          bg_img:res.data.bg_img.itempic
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

})