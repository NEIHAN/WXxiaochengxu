var util = require('../../utils/util.js');
const app = getApp()
//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js')
const imgUrlThumbnail = 'http://gcj-statics.oss-cn-beijing.aliyuncs.com/gct/images/loading.gif'

Page({
  data:{
    options:{},
    commentsDetail:{},
    detail:{},
    hasLogin:false,
      selected: true,
      lazy: true,
      selected1: false,
    picSrc:'',

  },
  loadImage(pic) {
    //加载缩略图
    this.setData({
      msg: '大图正在拼命加载..',
      picSrc: ''
    })
    const _this=this
    //同时对原图进行预加载，加载成功后再替换
    this.imgLoader.load(pic, (err, data) => {
      console.log('图片加载完成', err, data.src)
      this.setData({ msg: '大图加载完成~' })
      this.setData({ load:true })

      if (!err)
        _this.setData({ picSrc: data.src })
    })
  },
  // onShareAppMessage: function () {

  //   return {
  //     title: '这服务超值！',
  //     // imageUrl: 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/share_new.jpg',
  //     path:"/pages/index/homeRepairDetail?id="+this.data.options.id
  //   }
  // },
  onShareAppMessage: util.share,
  goHome(){
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
    selected: function (e) {
        this.setData({
            selected1: false,
            selected: true
        })
    },
    selected1: function (e) {
        this.setData({
            selected: false,
            selected1: true
        })
      var self=this;

      wx.request({
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: 'post',
        url: 'https://www.zaihush.com/api/order/order_evaluate',
        data:{ cate_id:wx.getStorageSync('detailAll').id },
        success(res){
          console.log(res);
          self.setData({
            commentsDetail:res.data
          })

        }
      })
    },
  bindUser:function(e){
    app.bindUser(e,()=>{
      this.setData({hasLogin:true})
      let url='/pages/index/SingleReservation'

      wx.navigateTo({

        url:url
      })
      // this.hasLogin=true
    })
  },
  gotoGiveMoney(){
    wx.switchTab({
      url:'/pages/giveMoney/giveMoney'
    })
  },
  onShow: function () {
    this.setData({
      hasLogin:app.globalData.hasLogin
    })

  },
  onLoad(options){
    this.imgLoader = new ImgLoader(this)

    wx.removeStorageSync('detailAll')
    this.setData({
      options:options
    })
    var _this=this
    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method:'post',
      url:'https://www.zaihush.com/api/product/jdqxdetails',
      data:{
        id:options.id
      },
      success({data}){
        console.log('ajax data--:',data)
        _this.setData({
          detail:data.pro
        })
        _this.loadImage(data.pro.pic)

        wx.setStorageSync('detailAll', data.pro);
        wx.setStorageSync('jdqx', '家电清洗');
      }

    })
  },
})