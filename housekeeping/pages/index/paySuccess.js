var util = require('../../utils/util.js');
/**
 * Created by liangx-h on 2018/5/23.
 */
Page({

  toOrder() {
    wx.reLaunch({
      url: "/pages/my/myorder?selected3=1",
    })
  },

  onLoad() {

    wx.showShareMenu();

  },

  onShareAppMessage: (options) => {
    // wx.request({
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //   },
    //   method:'post',
    //   url: 'https://www.zaihush.com/api/index/share',
    //   data:{ user_id:wx.getStorageSync('user_id') },
    //   success({ data }) {
    //     console.log('uuuuuuuu-===',data);
    //
    //     wx.reLaunch({
    //       url:  "/pages/index/index?shareTickets=1",
    //     })
    //   }
    // })

    return {
      title: '这服务超值！',
      imageUrl: 'http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/share_new.jpg',
      path: '/pages/index/index',
      success: function(res) {
        console.log('shareTickets--------', res);
        wx.request({
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          method: 'post',
          url: 'https://www.zaihush.com/api/index/share',
          data: {
            user_id: wx.getStorageSync('user_id')
          },
          success({
            data
          }) {
            console.log('uuuuuuuu-===', data);

            wx.reLaunch({
              url: "/pages/index/index?shareTickets=1",
            })
          }
        })
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
        if (res.shareTickets) {
          // 获取转发详细信息
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success(res) {
              // res.errMsg; // 错误信息
              // res.encryptedData;  //  解密后为一个 JSON 结构（openGId    群对当前小程序的唯一 ID）
              // res.iv; // 加密算法的初始向量
              console.log('分享人---', res);
            },
            fail() {},
            complete() {}
          });
        }
      },

      fail: function (res) {　　　　　　 // 转发失败之后的回调
        console.log('shareTickets--------', res);
        if (res.errMsg == 'shareAppMessage:fail cancel') {// 用户取消转发

        } else if (res.errMsg == 'shareAppMessage:fail') {　　　　　　　　 // 转发失败，其中 detail message 为详细失败信息
        }
      }

    }
  }
})