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
      data = data['data']['data']['reservationDate']
      console.log(data)
      
      
      data.forEach(element => {
        if(element in that.data.testData){

        }
        else{
          that.data.testData.push(element)
          that.data.testData.sort((x,y) => x.roomId - y.roomId)
        }
      });

      that.setData({
        'testData': that.data.testData,

      });
      wx.hideToast();

    }
    
    // 处理没找到搜索到结果或错误情况
    function doFail(err) {

      var message = typeof err === 'undefined' ? '未搜索到相关结果' : err;
      
      setMessageObj(false, message);
      wx.hideToast();
    }
    
    app.showLoadToast();

    var date = that.data.date;
    console.log(date);
    var subareaId = 21;
    wx.request({
      url: 'https://libseminarroom.bjut.edu.cn/reservation/list?subareaId='+subareaId+"&date="+date,
      cookie: app.globalData.cookies[0],
      method: 'POST',
      success: function (res) {
        console.log(res)
        doSuccess(res, true);
      }

    })
    var subareaId = 20;
    wx.request({
      url: 'https://libseminarroom.bjut.edu.cn/reservation/list?subareaId='+subareaId+"&date="+date,
      cookie: app.globalData.cookies[0],
      method: 'POST',
      success: function (res) {
        console.log(res)
        doSuccess(res, true);
      }

    })
    var subareaId = 22;
    wx.request({
      url: 'https://libseminarroom.bjut.edu.cn/reservation/list?subareaId='+subareaId+"&date="+date,
      cookie: app.globalData.cookies[0],
      method: 'POST',
      success: function (res) {
        console.log(res)
        doSuccess(res, true);
      }

    })
    var subareaId = 24;
    wx.request({
      url: 'https://libseminarroom.bjut.edu.cn/reservation/list?subareaId='+subareaId+"&date="+date,
      cookie: app.globalData.cookies[0],
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
    // wx.request({
    //   url: app._server + '/api/get_student_info.php',
    //   method: 'POST',
    //   data: app.key({
    //     openid: app._user.openid,
    //     key: inputValue,
    //     page: that.data.main.page
    //   }),
    //   success: function(res) {
        
    //     if(res.data && res.data.status === 200) {

    //       doSuccess(res.data.data, true);
    //     }else{

    //       app.showErrorModal(res.data.message);
    //       doFail(res.data.message);
    //     }
    //   },
    //   fail: function(res) {
        
    //     app.showErrorModal(res.errMsg);
    //     doFail(res.errMsg);
    //   }
    // });

  },

  // main——最优
  bindOpenList: function (e) {
    var index = !isNaN(e) ? e : parseInt(e.currentTarget.dataset.index),
        data = {};
    //app.showLoadToast();
    console.log(this.data.testData[index]);
    app.globalData.confirm_data = this.data.testData[index];
    app.globalData.confirm_date = this.data.date;
    wx.navigateTo({
      url: '/pages/confirm/confirm',
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
    if(app.globalData.cookies == null){
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }

    if(this.data.testData.length == 0)
      this.search()
    // if(wx.getStorageSync('LoginSuccess') && this.data.main.total == 0){
    //   this.search("COMP")
    // }
    // if(!wx.getStorageSync('LoginSuccess')){
    //   app.showErrorModal('请先至少登陆一次才能使用此功能', '此功能为内部功能');
    //   wx.hideKeyboard();
    // }
    
  },
  onReady: function(){
  },

  /**
   * 点击日期时候触发的事件
   * bind:getdate
   */
  getdate(e) {
    //console.log(e.detail);
    this.data.testData = []
    this.setData({
      date:e.detail.datestr,
      "testData": this.data.testData
    })
    this.data.date = e.detail.datestr
    console.log(this.data.date)
    this.search()
  },
  /**
   * 点击全选触发的事件
   * bind:checkall
   */
  checkall(e) {
    console.log(e.detail.days);
  },
  /** 
  * 点击确定按钮触发的事件
  * bind:select
  */
  cmfclick(e){
    this.data.testData = []
    this.setData({
      date:e.detail.selectDays[0],
      "testData": this.data.testData
    })
    this.data.date = e.detail.selectDays[0]
    console.log(this.data.date)
    this.search()
  },
  /** 
  * 点击清空事件
  * bind:clear
  */
  clear(e) {
    console.log("要清空选中日期")
  }
});
