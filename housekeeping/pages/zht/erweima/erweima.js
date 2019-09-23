var request = require('../../../utils/request.js');
var util = require('../../../utils/util.js');
// pages/zht/erweima/erweima.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name : "",
    avatar : "",
    img_url : "",
    windowWidth: wx.getStorageSync("windowWidth"),
    shareImgSrc: "",
    ctxYesOnNo: false,
    imgPath: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth
        })
        // wx.setStorageSync("windowHeight", res.windowHeight);
      },
    })

    wx.downloadFile({
      url: "https://www.zaihush.com/public/images/erweima.png",
      success: function (res) {
        console.log(res);
        //缓存二维码
        that.setData({
          imgPath: res.tempFilePath
        })
        that.digital();
      }
    })
  },

  digital() {
    var that = this;
    request.ajax("index.php/api/sign/getToken", {
      user_id: wx.getStorageSync('user_id') ? wx.getStorageSync('user_id') : ''
    }, function (data) {

      wx.downloadFile({
        url: data.res.avatar,
        success: function (res) {
          //缓存二维码
          that.setData({
            avatar: res.tempFilePath
          })
          that.tempFilePath(data.res.img_url);
        }
      })

      that.setData({
        name: data.res.name,
        // avatar: data.res.avatar,
        // img_url: data.res.img_url
      });
    });

  },

  tempFilePath(url){
    var that = this;
    wx.downloadFile({
      url: url,
      success: function (res) {
        //缓存二维码
        that.setData({
          img_url: res.tempFilePath
        })
        that.drawImage();
        setTimeout(function () {
          that.canvasToImage()
        }, 300)
      }
    })
  },

  drawImage() {
    //绘制canvas图片
    var that = this
    var windowWidth = this.data.windowWidth;
    const ctx = wx.createCanvasContext('myCanvas');

    var imgPath = that.data.imgPath;
    var bgImgPath = that.data.img_url;
    var avatar = that.data.avatar;
 
    ctx.drawImage(imgPath, 0, 0, windowWidth, 2.0 * windowWidth);

    ctx.drawImage(bgImgPath, windowWidth / 2.4, windowWidth * 1.54, 80, 80);

    ctx.save();
    ctx.beginPath();
    //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    ctx.arc(33 + windowWidth / 2.3, 33 + windowWidth * 1.29, 33, 0, Math.PI * 2, false);
    ctx.clip();//画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
    ctx.drawImage(avatar, windowWidth / 2.3, windowWidth * 1.29, 66, 66);
    ctx.restore();

    ctx.setFontSize(15);
    ctx.setFillStyle('#fff')
    ctx.fillText(that.data.name, windowWidth / 2.3, windowWidth * 1.5)

    ctx.setFontSize(13);
    ctx.setFillStyle('#000')
    ctx.fillText("长按识别二维码注册会员后领取红包", windowWidth / 4, windowWidth * 0.97)

    ctx.setFontSize(36);
    ctx.setFillStyle('#f00')
    ctx.fillText("188元红包", windowWidth / 3.5, windowWidth * 1.18)
    ctx.draw();
  },

  /**
   * 
   */
  canvasToImage() {
    var that = this;
    var windowWidth = this.data.windowWidth;
    var scale = 2;
    wx.showLoading({
      icon: 'loading',
      mask: true,
      title: '开始绘制图片',
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowWidth,
      height: windowWidth * scale,
      destWidth: windowWidth * 2,
      destHeight: (windowWidth * scale) * 2,
      canvasId: 'myCanvas',
      fileType: 'png',
      quality: 1,
      success: function (res) {
        wx.hideLoading();
        that.setData({
          shareImgSrc: res.tempFilePath,
          ctxYesOnNo: true
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
  * 当用户点击分享到朋友圈时，将图片保存到相册
  */
  savePicture() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImgSrc,
      success(res) {
        wx.showModal({
          title: '存图成功',
          content: '图片成功保存到相册了，快去转发吧~',
          showCancel: false,
          confirmText: '好的',
          success: function (res) {
            
          }
        })
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
  onShareAppMessage: util.share
})