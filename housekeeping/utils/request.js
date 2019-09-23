var api = require('./api.js');
var utils = require('./util.js');

/**
 * ajax
 */
function ajax(url ,data, successCb, errorCb, completeCb) {
  wx.showLoading({
    icon: 'loading',
    mask: true,
    title: '加载中',
  })
  wx.request({
    url: api.API_BASE + url,
    method: 'POST',
    data: data,
    header: {
      "content-type": 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    success: function (res) {
      wx.hideLoading();
      if (res.statusCode == 200){
        utils.isFunction(successCb) && successCb(res.data);
      }
      else{
        wx.showModal({
          title: '提示',
          content: '网络错误，请稍后重试',
          showCancel: false,//是否显示取消按钮
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        console.log('请求异常', res);
      }
    },
    fail: function () {
      wx.hideLoading();
      utils.isFunction(errorCb) && errorCb();
    },
    complete: function () {
      wx.hideLoading();
      utils.isFunction(completeCb) && completeCb();
    }
  });
};

const invite = () => {
  if (!wx.getStorageSync('user_id')){
    console.log("未登录");
    return;
  }
  if (!wx.getStorageSync('invitePeople')) {
    console.log("没有邀请人");
    return;
  }

  if (wx.getStorageSync('invitePeople') == wx.getStorageSync('user_id')) {
    console.log("用户重复");
    return;
  }

  ajax("index.php/api/sign/inviter_list", {
    user_id: wx.getStorageSync('user_id') ? wx.getStorageSync('user_id') : '',
    pid: wx.getStorageSync('invitePeople') ? wx.getStorageSync('invitePeople') : ''
  }, function (data) {
    console.log(data);
  });

}

module.exports = {
  ajax: ajax,
  invite: invite
}