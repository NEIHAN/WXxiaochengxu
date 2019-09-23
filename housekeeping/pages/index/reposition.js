var util = require('../../utils/util.js');
// pages/index/reposition.js
var tcity = [];
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
var qqmapsdk;
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
    address:'',
    user_id: '',
    adds: [],
    posAddr: '',

    provinces: [],
    province: '',
    choiceprovince:'北京市',
    citys: [],
    city: "",
    choicecity: '北京市',
    countys: [],
    county: '',
    choicecounty: '朝阳区',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
  },
  onLoad(){
    let self=this;
    qqmapsdk = new QQMapWX({//申请的秘钥
      key: 'NSDBZ-Y3VR6-WLYST-MKHBO-RLTXH-Q2FOY'
    });
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            console.log(addressRes);
            self.setData({
              wd: addressRes.result.location.lat,
              jd: addressRes.result.location.lng,
              address: addressRes.result.address
            })
            app.globalData.positionAddr = addressRes.result.address;
          },
          fail: function() {
          },
        })
      },
      fail: function() {
      },
    })

    self.data.user_id = app.globalData.userId || 1
    self.getaDDRESS()

    //这里是选择省市区
    var that = this;
    tcity.init(that);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
   
  },
  getaDDRESS(){
    var self =this
    wx.request({
      method: 'get',
      url: 'https://www.zaihush.com/api/address/index?user_id=' + wx.getStorageSync('user_id'),
      success({ data }) {
        self.setData({
          adds: data.adds
        })
        console.log(data)
      }
    })
  },
  /**
   * 组件的方法列表
   */
  bindChange: function (e) {
    //省市区
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  closeAddress() {//取消选择省市区
    this.setData({
      condition: false
    })
  },
  sureAddress() {//确定选择省市区
    let that = this;
    this.setData({
      choiceprovince: that.data.province,
      choicecity: that.data.city,
      choicecounty: that.data.county,
      condition: false
    })
    app.globalData.positionAddr = that.data.province + that.data.city + that.data.county;
  },
  choiceAddress: function () {//点击选择省市区
    this.setData({
      condition: !this.data.condition
    })
  },
  rePosition(){//重新定位
    let self = this;
    qqmapsdk = new QQMapWX({//
      key: 'NSDBZ-Y3VR6-WLYST-MKHBO-RLTXH申请的秘钥-Q2FOY'
    });
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            console.log(addressRes);
            self.setData({
              wd: addressRes.result.location.lat,
              jd: addressRes.result.location.lng,
              address: addressRes.result.address
            })
            app.globalData.positionAddr = addressRes.result.address;
          },
          fail: function() {
          },
        })
      },
      fail: function() {
      },
    })
  },
  addLoacatin(){
    wx.navigateTo({
      url: '../../pages/my/newaddress',
    })
  },
  checkOneAddr(e) {
    console.log(e)
    let addr = e.currentTarget.dataset.addr.split('-');
    let detail = e.currentTarget.dataset.detail
    this.setData({
      choiceprovince: addr[0],
      choicecity: addr[1],
      choicecounty: addr[2],
      condition: false
    })
    app.globalData.positionAddr = addr.join('')+detail;
  },
  onShow(){
    this.getaDDRESS()

  }
  
})
