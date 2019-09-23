var shareData = {
  tit : "这服务超值！",
  imaUrl : "http://zaihumnorj.oss-cn-hangzhou.aliyuncs.com/share_new.jpg",
  pt : "/pages/index/index"
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isFunction = obj => {
  return typeof obj === 'function';
}

const share = res => {
  return {
    title: shareData.tit,
    imageUrl: shareData.imaUrl,
    path: shareData.pt + '?userid=' + wx.getStorageSync('user_id'),
    success: function (res) {
    },
    fail: function (res) {
      // 分享失败
      console.log(res)
    }
  }
}


module.exports = {
  formatTime: formatTime,
  isFunction: isFunction,
  share: share,
  shareData: shareData
}
