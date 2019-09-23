const app = getApp()

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
    address: null,
    orderArr:[],
    tool:[],
    active_orderItem:'',
    extraPrice:[],
    totalPrice:0,
    service_id:'',
    suggestShow: true,
    canNext:true,
  },
  timerShow() {//保洁的类型 50元
    this.setData({
      suggestShow: false
    })
  },
  iKnow() {//建议时长 我知道了
    this.setData({
      suggestShow: true
    })
  },
  selectBrand(e){
    let cutPrice = this.data.totalPrice-this.data.active_orderItem+e.currentTarget.dataset.name.pro_price
    this.setData({
      active_orderItem:e.currentTarget.dataset.name.pro_price,
      service_id:e.currentTarget.dataset.name.id,
      totalPrice:cutPrice
    })
  },
  checkboxChange(e){
    let arr=[],index1=0
    this.data.extraPrice.forEach((item,index)=>{
      arr.push(item)
      if(item.split('-')[0]==e.currentTarget.dataset.id){
        index1=index
      }
    })
    console.log(e);
    let selectItem=e.detail.value.length?e.currentTarget.dataset.id+'-'+e.detail.value[0]+'-'+e.currentTarget.dataset.id+'-'+e.currentTarget.dataset.name:e.currentTarget.dataset.id+'-'+0+'-'+'00'+'-'+0
    arr.splice(index1,1,selectItem)


    let cutPrice = e.detail.value.length?Number(e.currentTarget.dataset.price):-Number(e.currentTarget.dataset.price)

    cutPrice =  this.data.totalPrice+cutPrice

    this.setData({
      extraPrice:arr.map(item=>{
        return item
      }),
      totalPrice:cutPrice
    })
    console.log(arr);
  },
  /**
   * 生命周期函数--监听页面加载
   *
   * tool_name
   :
   "挂式空调清洗（两台）"
   tool_price
   :
   "178.00"
   tool_unit
   :
   "元"
   */
  onLoad: function (options) {
    let self=this

    wx.request({
      method: 'get',
      url: 'https://www.zaihush.com/index.php/api/activity/service',
      data:{
        act_item_id:options.act_item_id
      },
      success(res){
        self.setData({
          orderArr: res.data.act_service,
          tool: res.data.tool,

          active_orderItem:res.data.act_service[0].pro_price,
          service_id:res.data.act_service[0].id,
          extraPrice:res.data.tool.map(item=>{
            return  item.id+'-'+0+'-'+'00'+'-'+0
          }),
          totalPrice:res.data.act_service[0].pro_price
        })

      }
    })
  },
  getDefaultAddress() {
    let self=this
    app.getDefaultAddress((data) =>{
      self.setData({

        address: data
      })

      console.log('reveived get default address data in show--:', data)
    })
  },
  buy(){
    let _this=this
    if(_this.data.canNext){

      _this.setData({

        canNext: false
      })
      wx.request({
        method: 'get',
        url: 'https://www.zaihush.com/index.php/api/activity/get_service',
        data:{
          act_item_id:Number(wx.getStorageSync('act_item_id')),
          service_id:_this.data.service_id
        },
        success(res){
          console.log('res',res);
          let arr1=[],arr2=[]
          _this.data.extraPrice.forEach(item=>{
            if(item.split('-')[2]!='00'){
              arr1.push(Number(item.split('-')[2]))
            }

          })
          _this.data.extraPrice.forEach(item=>{
            if(item.split('-')[3]!=0){
              arr2.push(item.split('-')[3])
            }
          })
          let activityAll={
            service_cs:res.data.res.service_cs,
            service_cycle:res.data.res.service_cycle,
            service_duration:res.data.res.service_duration,
            service_items:res.data.res.service_items,
            service_number:res.data.res.service_number,
            service_ttime:res.data.res.service_ttime,
            service_frequency:res.data.res.service_frequency,
            total:_this.data.totalPrice,
            activity_id:Number(wx.getStorageSync('activity_id')),
            act_item_id:Number(wx.getStorageSync('act_item_id')),
            tool_id:arr1,
            tool_name:arr2,
            service_id:_this.data.service_id,
            order_activity:1,
          }
          wx.setStorageSync('activityAll', activityAll);
          wx.setStorageSync('totalShow', _this.data.totalPrice);
          console.log('activityAll', activityAll);
          _this.setData({

            canNext: true
          })
          wx.navigateTo({
            url: "/pages/my/confirmOrder?fromActivity=1",
          })

        }
      })

    }

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
    this.getDefaultAddress()

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