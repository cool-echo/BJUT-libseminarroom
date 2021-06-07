//app.js
App({
  onLaunch: function () {
    wx.request({
      url: 'https://libseminarroom.bjut.edu.cn/login',
      method: 'POST',
      timeout: 3000,
      fail: function(res){
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: "本程序需要在校园网下运行，请连接校内网！"
        });
      },
    })
  },
  showErrorModal: function(content, title) {
    wx.showModal({
      title: title || '加载失败',
      content: content || '未知错误',
      showCancel: false
    });
  },
  showLoadToast: function(title, duration) {
    wx.showToast({
      title: title || '加载中',
      icon: 'loading',
      mask: true,
      duration: duration || 10000
    });
  },
  globalData: {
    cookies: null,
    username: null,
    password: null,
    data: null,
    confirm_data: null,
    confirm_date: null,
  }
})
