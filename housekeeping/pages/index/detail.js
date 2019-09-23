const app = getApp()
var util = require('../../utils/util.js');
/**
 * 加载单张图片测试页
 */

//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js')
const imgUrlThumbnail = 'http://gcj-statics.oss-cn-beijing.aliyuncs.com/gct/images/loading.gif'

Page({
  onShareAppMessage: function() {

    return {
      title: '这服务超值！',
      // imageUrl: 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/share_new.jpg',
      path: '/pages/index/detail?id=' + this.data.pageQuery.id + '&&catname=' + this.data.pageQuery.catname
    }
  },
  //接评论
  getComents() {
    var self = this;
    console.log('detail======', this.data.d);

    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'post',
      url: 'https://www.zaihush.com/api/order/order_evaluate',
      data: {
        cate_id: wx.getStorageSync('detailAll').cate_id
      },
      success(res) {
        console.log(res);
        self.setData({
          commentsDetail: res.data
        })

      }
    })
  },
  goHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  bindUser: function(e) {
    console.log(1111111);
    app.bindUser(e, () => {
      this.setData({
        hasLogin: true
      })
      let url = '/pages/index/SingleReservation?catname=' + this.data.d.pro.id + '&&yy1_id=' + this.data.d.pro.yy1_id
      console.log('fucku url--:', url)
      wx.navigateTo({

        url: url
      })
      // this.hasLogin=true
    })
  },
  gotoGiveMoney() {
    wx.switchTab({
      url: '/pages/giveMoney/giveMoney'
    })
  },
  data: {
    hasLogin: false,
    commentsDetail: {},
    d: null,
    "stars": '',
    pageQuery: {},
    selected: true,
    lazy: true,
    selected1: false,
    load: false,
    phonecall: '18701031737',
    picSrc: '',
    btnclass: '',
    yy1id: '',
    yuyueNmae: '立即预约',
  },
  loadImage(pic) {
    //加载缩略图
    this.setData({
      msg: '大图正在拼命加载..',
      picSrc: ''
    })
    const _this = this
    //同时对原图进行预加载，加载成功后再替换
    this.imgLoader.load(pic, (err, data) => {
      console.log('图片加载完成', err, data.src)
      this.setData({
        msg: '大图加载完成~'
      })
      this.setData({
        load: true
      })

      if (!err)
        _this.setData({
          picSrc: data.src
        })
    })
  },
  onLoad(options) {
    //初始化图片预加载组件

    this.imgLoader = new ImgLoader(this)
    if (options.catname == "空房开荒" || options.catname == "深度清洁" || options.catname == "整屋服务" || options.catname == "夜间服务") {
      this.setData({
        btnclass: "bigClass",
      })
    }
    this.setData({
      pageQuery: options,
      yy1id: wx.getStorageSync('yy1id')

    })
    if (wx.getStorageSync('yy1id') == 1) {
      this.setData({
        yuyueNmae: '单次预约',

      })
    } else {
      this.setData({
        yuyueNmae: '立即预约',

      })
    }
    // console.log('fucku options:',options)
    wx.removeStorageSync('detailAll') //初次进来清空缓存的时间
    wx.removeStorageSync('timeRange') //初次进来清空缓存的优惠券
    wx.removeStorageSync('totalPrice') //初次进来清空缓存的优惠券
    app.getServiceDetail(options.id, this)
    var self = this;
    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'post',
      url: 'https://www.zaihush.com/api/product/index?id=' + options.id,
      success(res) {
        // self.setData({
        //   picSrc1: res.data.pro.pic
        // })
        self.loadImage(res.data.pro.pic)
      }
    })

  },
  callphone() { //客服电话
    const self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.phonecall
    })
  },
  onShow: function() {
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
    // 页面显示
    var that = this;
    var renderData = {
      "stars": that.starCount(2)
    };
    that.setData(renderData)
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  //计算行星显示规则
  starCount: function(originStars) {
    //计算星星显示需要的数据，用数组stars存储五个值，分别对应每个位置的星星是全星、半星还是空星
    var starNum = originStars * 10 / 10,
      stars = [],
      i = 0;
    do {
      if (starNum >= 1) {
        stars[i] = 'full';
      } else if (starNum >= 0.5) {
        stars[i] = 'half';
      } else {
        stars[i] = 'no';
      }
      starNum--;
      i++;
    } while (i < 5)
    return stars;
  },
  formSubmit: function(event) {
    var that = this;
    var renderData = {
      "stars": that.starCount(event.detail.value.input)
    };
    that.setData(renderData);
  },
  selected: function(e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function(e) {
    this.getComents()
    this.setData({
      selected: false,
      selected1: true
    })
  }
})