var util = require('../../utils/util.js');
// pages/my/newaddress.js
var tcity = []
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: '请选择地址',
    detail_addr: '',
    linkman: '',
    contact_num: '',
    square: '',
    isDefault: 0,
    user_id: null,
//选择省市区
    provinces: [],
    province: '',
    sureprovince: "请选择地址",
    citys: [],
    city: "",
    surecity: "",
    countys: [],
    county: '',
    surecounty: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    suggestShow:true,
    showaddressModal:false,
    select2Show:false,
    select3Show:false,
    select4Show:false,
    provinceArr:[],
    provinceSelected:'请选择',
    citySelected:'请选择',
    cityArr:[],
    districtSelected:'请选择',
    districtArr:[],
    streetSelected:'请选择',
    streetArr:[],
    tab1TapShow:true,
    tab2TapShow:false,
    tab3TapShow:false,
    tab4TapShow:false,
    provinceCode:'',
    cityCode:'',
    districtCode:'',
    streetCode:'',
  },
  preventTouchMove(e){
    e=e||window.event
    e.preventDefault()
  },
  hideModal(){
    this.setData({
      showaddressModal:false,

    })
  },
  //tab1点击
  provinceTabTap(){
    this.setData({
      tab1TapShow:true,
      tab2TapShow:false,
      tab3TapShow:false,
      tab4TapShow:false,
    })
  },
  //tab2点击
  cityTabTap(){
    this.setData({
      tab1TapShow:false,
      tab2TapShow:true,
      tab3TapShow:false,
      tab4TapShow:false,
    })
  },
  //tab3点击
  districtTabTap(){
    this.setData({
      tab2TapShow:false,
      tab3TapShow:true,
      tab1TapShow:false,
      tab4TapShow:false,

    })
  },
  //tab4点击
  streetTabTap(){
    this.setData({
      tab3TapShow:false,
      tab4TapShow:true,
      tab1TapShow:false,
      tab2TapShow:false,
    })
  },
  //获取省份
  getProvince(){
    let _this=this
    wx.request({
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      url: 'https://www.zaihush.com/api/area/index',
      success({ data }) {
       console.log(data);
        _this.setData({
          provinceArr:data.province
        })
      }
    })
  },
  //点击省份
  provinceTap(e){
    let code = e.currentTarget.dataset.code
    let name = e.currentTarget.dataset.name
    this.setData({
      provinceSelected:name,
      select2Show:true,
      position:'请选择地址',
      select4Show:false,
      select3Show:false,
      citySelected:'请选择',
      provinceCode:code,

    })
    let _this=this
    wx.request({
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      url: 'https://www.zaihush.com/api/area/region',
      data:{
        code:code
      },
      success({ data }) {
        _this.setData({
          cityArr:data.data,
          tab1TapShow:false,
          tab2TapShow:true,
        })

      }
    })
    console.log(code);
  },
  // 点击城市
  cityTap(e){
    let code = e.currentTarget.dataset.code
    let name = e.currentTarget.dataset.name
    this.setData({
      citySelected:name,
      select3Show:true,
      position:'请选择地址',
      select4Show:false,
      districtSelected:'请选择',
      cityCode:code,

    })
    let _this=this
    wx.request({
        method: 'POST',
        header: { "content-type": "application/x-www-form-urlencoded" },
        url: 'https://www.zaihush.com/api/area/region',
        data:{
          code:code
        },
        success({ data }) {
          _this.setData({
            districtArr:data.data,
            tab2TapShow:false,
            tab3TapShow:true,
          })

        }
    })
  },
  // 点击城市
  districtTap(e){
    let code = e.currentTarget.dataset.code
    let name = e.currentTarget.dataset.name
    this.setData({
      districtSelected:name,
      select4Show:true,
      streetSelected:'请选择',
      position:'请选择地址',
      districtCode:code,
    })
    let _this=this
    wx.request({
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      url: 'https://www.zaihush.com/api/area/region',
      data:{
        code:code
      },
      success({ data }) {
        _this.setData({
          streetArr:data.data,
          tab3TapShow:false,
          tab4TapShow:true,
        })

      }
    })
  },
 //点击街道
  streetTap(e){
    let _this=this

    let code = e.currentTarget.dataset.code
    let name = e.currentTarget.dataset.name
    this.setData({
      streetCode:code
    })
    let position = `${this.data.provinceSelected}${this.data.citySelected}${this.data.districtSelected}${name}`
    wx.request({
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      url: 'https://www.zaihush.com/api/area/check',
      data:{
        province:this.data.provinceCode,
        city:this.data.cityCode,
        area:this.data.districtCode,
        street:this.data.streetCode,
      },
      success({ data }) {
        console.log(data);
        if(data.status==1){
          _this.setData({
            streetSelected:name,
            showaddressModal:false,
            position:position
          })
        }else{
          wx.showToast({
            title: data.err,
            icon:'none',
            duration:800
          })
        }

      }
    })




  },
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
  closeAddress(){//取消选择省市区
    this.setData({
      condition: false
    })
  },
  sureAddress(){//确定选择省市区
    let that=this;
    this.setData({
      sureprovince: that.data.province,
      surecity: that.data.city,
      surecounty: that.data.county,
      condition: false
    })
  },
  choiceAddress: function () {//点击选择省市区
    this.setData({
      showaddressModal:true
    })
  },
  timerShow(){//建议时长
    this.setData({
      suggestShow: false
    })
  },
  iKnow(){//建议时长 我知道了
    this.setData({
      suggestShow: true
    })
  },

  submitAddr() {
    const self = this.data;
    // const position = self.sureprovince +''+ self.surecity +''+ self.surecounty;
    const data = {
      user_id: self.user_id,
      loca_addr: self.position,
      linkman: self.linkman,
      detail_addr: self.detail_addr,
      contact_num: self.contact_num,
      square_num: self.square,
      is_default: self.isDefault
    }
    if(self.square==''||self.position=='请选择地址'){
      wx.showToast({
        title: '请确认填写平方数和您的地址',
        icon:'none'
      })
    }else{
      wx.showLoading({
        mask: true,
        success(req) {
          wx.request({
            method: 'POST',
            header: { "content-type": "application/x-www-form-urlencoded" },
            url: 'https://www.zaihush.com/api/address/add_adds',
            data: data,
            success({ data }) {
              wx.hideLoading();
              if(data.status === 1){
                wx.showToast({
                  title: '保存成功',
                  icon: 'success'
                })
                wx.navigateBack({
                  delta: 1
                })
              }else{
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

    }
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
  iphoneInput(e){
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (e.detail.value.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    }  else if (!myreg.test(e.detail.value) || e.detail.value.length < 11) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    else {//填写正确
      this.setData({
        contact_num: e.detail.value
      })
    }
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
    this.getProvince()
    this.setData({
        user_id: app.globalData.userId
    })

    console.log('this.data.user_id',this.data.user_id,app.globalData.userId)
    
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