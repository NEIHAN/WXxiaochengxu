const app = getApp()
//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js')
const imgUrlThumbnail = 'http://gcj-statics.oss-cn-beijing.aliyuncs.com/gct/images/loading.gif'

Page({
  onShareAppMessage: function () {

    return {
      title: '这服务超值！',
      //imageUrl: 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/share_new.jpg',
      path:'/pages/activityDetail/activityDetail?act_item_id='+wx.getStorageSync('act_item_id'),
    }
  },
  //接评论
  getComents(){
    var self=this;

    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'post',
      url: 'https://www.zaihush.com/api/order/order_act_evaluate',
      data:{ act_item_id:wx.getStorageSync('act_item_id') },
      success(res){
        console.log(res);
        self.setData({
          commentsDetail:res.data
        })

      }
    })
  },
  goHome(){
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  bindUser:function(e){
    app.bindUser(e,()=>{
      this.setData({hasLogin:true})
      let url='/pages/confirmorder-activity/confirmorder-activity?act_item_id='+this.data.act_item_id
      wx.navigateTo({
        url:url
      })
    })
  },
  gotoGiveMoney(){
    wx.switchTab({
      url:'/pages/giveMoney/giveMoney'
    })
  },
  data: {
    hasLogin:false,
    load: false,

    commentsDetail:{},
    "stars": '',
    pageQuery:{},
    selected: true,
    lazy: true,
    selected1: false,
    phonecall: '18701031737',
    picSrc:'',
    btnclass:'',
    yy1id:'',
    yuyueNmae:'立即预约',
    activityDetail:{},
    act_item_id:'',
    pro_detail_img:'',
  },
  loadImage(pic) {
    //加载缩略图
    this.setData({
      msg: '大图正在拼命加载..',
      pro_detail_img: ''
    })
    const _this=this
    //同时对原图进行预加载，加载成功后再替换
    this.imgLoader.load(pic, (err, data) => {
      console.log('图片加载完成', err, data.src)
      _this.setData({ msg: '大图加载完成~' })
      _this.setData({ load:true })

      if (!err)
        _this.setData({ pro_detail_img: data.src })
    })
  },
  onLoad(options){
    this.imgLoader=new ImgLoader(this)
    console.log(app.globalData);
    wx.setStorageSync('act_item_id', options.act_item_id);
    var self=this;
    wx.request({
      method:'get',
      url:'https://www.zaihush.com/index.php/api/activity/details',
      data:{
        act_item_id:options.act_item_id
      },
      success(res){
        console.log('活动详情--------',res);
        self.setData({
          activityDetail:res.data.act_detail,
          act_item_id:options.act_item_id,
        })
        wx.setStorageSync('activity_id', res.data.act_detail.activity_id);
        wx.setStorageSync('act_item_id', res.data.act_detail.act_item_id);
        self.loadImage(res.data.act_detail.pro_detail_img)

      }
    })

  },
  callphone() {//客服电话
    const self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.phonecall
    })
  },
  onShow: function () {
    wx.removeStorageSync('activityAll')
    this.setData({
      hasLogin:app.globalData.hasLogin,
    })

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //计算行星显示规则

  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.getComents()
    this.setData({
      selected: false,
      selected1: true
    })
  }
})