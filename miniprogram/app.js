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
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
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
    name: null,
    username: null,
    password: null,
    data: null,
    confirm_data: null,
    confirm_date: null,
  }
})
