//xs.js
//获取应用实例
var app = getApp();
var util = require('../../utils/timeutil.js');
Page({
  data: {
    testData: [],
    date: util.formatTime(new Date())
  },
  onShareAppMessage: function () {
    return {
      title: 'We-BJUT(一个高效的研讨室预约小工具)',
      
    }
  },



  // 搜索
  search: function () {
    if(app.globalData.cookies != null){
      
    var that = this

    // 处理成功返回的数据
    function doSuccess(data, messageDisplay) {
      data = data['data']['data']
      console.log(data)
    
      data.forEach(element => {
        if(element in that.data.testData){

        }
        else{
          that.data.testData.push(element)
          that.data.testData.sort((x,y) => y.ReservationID - x.ReservationID)
          that.setData({
            'testData': that.data.testData,
          });

        }
      });
      wx.hideToast();
    }
    
    app.showLoadToast();

    var date = that.data.date;
    console.log(date);
    var subareaId = 21;
    wx.request({
      url: 'https://libseminarroom.bjut.edu.cn/reservation/mylist',
      header:{
        "cookie": app.globalData.cookies[0]
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        doSuccess(res, true);
      }

    })

  }
  else{
    app.showErrorModal('请先至少登陆一次才能使用此功能', '提醒');
  }

  },

  // main——最优
  bindOpenList: function (e) {
    var _this = this;
    var index = !isNaN(e) ? e : parseInt(e.currentTarget.dataset.index),
        data = {};
    //app.showLoadToast();
    console.log(this.data.testData[index]);
    var data = this.data.testData[index];
    var ReservationID = data.ReservationID
    wx.showModal({
      title: '确认',
      content: '确定要删除此预约？',
      success: function (res) {
        if (res.cancel) {
        } else {
          wx.showLoading({
            title: '加载中',
          })
           wx.request({
             url: 'https://libseminarroom.bjut.edu.cn/reservation/mydelete?id='+ReservationID+'&action=delete',
             header:{
              "cookie": app.globalData.cookies[0]
            },
            method: 'POST',
            success: function (res) {
              wx.hideLoading({
                success: (res) => {},
              })
              console.log(res)
              const msg = res['data']['msg']
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: msg
              });
              _this.search();
            }
            
           })
        }
     },
    })
    
  
  },

  bind: function(){
    data = data['data']['data']['reservationDate']
    this.data
  },

  onShow: function(options){
    var _this = this;
    // var dateTmp = util.formatTime(new Date());
    // this.setData({
    //   date: dateTmp
    // });
    if(this.data.testData.length != 0)
      return;
    if (wx.getStorageSync('username') != null & wx.getStorageSync('username') != "") {
      var username = wx.getStorageSync('username')
      var password = wx.getStorageSync('password')
      wx.request({
        url: 'https://libseminarroom.bjut.edu.cn/login?loginname=' + username + '&password=' + password,
        method: 'POST',
        timeout: 3000,
        success: function (res) {
          console.log(res)
          var data = res['data']
          var msg = data['msg']
          app.globalData.cookies = res['cookies']
          app.globalData.data = data
          _this.search()
        }
      })
    }
    else{
    if(app.globalData.cookies == null){
      app.showErrorModal('请先至少登陆一次才能使用此功能', '提醒');
    }
  }

    
  },
  onReady: function(){
  },

  onPullDownRefresh: function(){
    this.data.testData = []
    this.search()
  },

});
