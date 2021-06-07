// coaches-detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime:[
      "08:00", "08:30",
      "09:00", "09:30", 
      "10:00", "10:30", 
      "11:00", "11:30",
      "12:00", "12:30", 
      "13:00", "13:30", 
      "14:00", "14:30",
      "15:00", "15:30", 
      "16:00", "16:30", 
      "17:00", "17:30",
      "18:00", "18:30", 
      "19:00", "19:30", 
      "20:00", "20:30",
    ],
    endTime: ["请先选择起始时间"],
    selstartTime:"请选择",
    selendTime:"请选择",
    date : null,
    roomData: null,
    activedateid : 0,
    modalContent: "",
    modalHidden: true,
    otheruserID: ""
  },
  onShareAppMessage: function () {
    return {
      title: 'We-BJUT(一个高效的研讨室预约小工具)',
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');
    if(app.globalData.confirm_data == null){
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
    var data = app.globalData.confirm_data;
    var date = app.globalData.confirm_date;
    console.log(data);
    console.log(date);
    const roomID = data.roomId;
    const that = this;
    that.setData({
          date: date,
          roomData: data,
    })    
    // var datetime = new Date();
    // const hours = datetime.getHours();
    // const minutes = datetime.getMinutes();
    // const curtime = (hours < 10 ? ('0' + hours) : hours) + ":" + (minutes < 10 ? ('0' + minutes) : minutes);
    // var startTime = that.data.startTime;
    // startTime = this.getTimeArray(startTime, curtime);
    // that.setData({
    //   date:date,
    //   startTime: startTime
    // })
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
  onShareAppMessage: function () {
  
  },
  initendTimeData: function (startTime) {

  },
  bindPickerstartTimeChange: function (event) {
    var selIterm = this.data.startTime[event.detail.value];
    if (selIterm === "今天无有效时间") {
      return;
    }
    var endTime = this.data.startTime;
    endTime = this.getTimeArray(endTime, selIterm);
    this.setData({
      selstartTime: selIterm,
      endTime: endTime
    })
    // this.initCityData(2, selIterm)
  },
  bindPickerendTimeChange: function (event) {
    var selIterm = this.data.endTime[event.detail.value];
    if (selIterm === "请先选择起始时间" || selIterm === "今天无有效时间"){
      return;
    }
    this.setData({
      selendTime: selIterm,
    })
  },
  tabClick: function (e) {
    var d = new Date();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    const curtime = (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    var startTime = [
      "08:00", "08:30",
      "09:00", "09:30", 
      "10:00", "10:30", 
      "11:00", "11:30",
      "12:00", "12:30", 
      "13:00", "13:30", 
      "14:00", "14:30",
      "15:00", "15:30", 
      "16:00", "16:30", 
      "17:00", "17:30",
      "18:00", "18:30", 
      "19:00", "19:30", 
      "20:00", "20:30",
    ];
    if (this.data.date[e.currentTarget.id].datestr.indexOf(curtime) >= 0){
      var datetime = new Date();
      const hours = datetime.getHours();
      const minutes = datetime.getMinutes();
      const curtime = (hours < 10 ? ('0' + hours) : hours) + ":" + (minutes < 10 ? ('0' + minutes) : minutes);
      startTime = this.getTimeArray(startTime, curtime);
    }
    this.setData({
      selstartTime: "请选择",
      selendTime: "请选择",
      startTime: startTime,
      endTime: ["请先选择起始时间"],
      activedateid: e.currentTarget.id
    });
  },
  fun_date: function(a){
    var date1 = new Date();
    var date2 = new Date(date1);
    date2.setDate(date1.getDate()+a);
    var mon = date2.getMonth() + 1;
    var day = date2.getDate();
    var time = (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    if(a === 0){
      time += '(今)';
    }
    else if (a === 1) {
      time += '(明)';
    }
    return time;
  },
  getTimeArray:function(arr,obj){
    var index = -1;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] > obj) {
        index = i;
        break;
      }
    }
    if (index != -1) {
      arr = arr.slice(index);
    }
    else {
      arr = ["今天无有效时间",];
    }
    return arr;
  },
  appointtap:function(){
    if (this.data.selendTime === "请选择" || this.data.selstartTime === "请选择"){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "信息填写错误"
      });
      return;
    }
    const curselDay = this.data.date[this.data.activedateid].datestr;
    this.setData({
      modalContent: '请确认您预定的信息: \r\n' + this.data.roomData.roomName + '\r\n预约日期: ' + this.data.date +'\r\n参加人: ' + this.data.otheruserID +'\r\n预约时间: ' + this.data.selstartTime + '--' + this.data.selendTime + '\r\n请检查无误后点击确认',
      modalHidden: false
    });
  },
  modalHide: function () {
    this.setData({
      modalContent: '',
      modalHidden: true
    });
    console.log(app.globalData.cookies)
    
    wx.request({
      url: 'https://libseminarroom.bjut.edu.cn/reservation/save?applyNo=20190511-0001&roomId='+this.data.roomData.roomId+"&roomPurposeId=6&otherUser="+this.data.otheruserID+"&applydate="+this.data.date+"&applytime="+this.data.selstartTime + "-" + this.data.selendTime,
      method: "POST",
      header:{
        "cookie": app.globalData.cookies[0]
      },
      success: function(res){
        const msg = res['data']['msg']
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: msg
        });
      }
      
    })


  },
  modalHideCancle: function () {
    this.setData({
      modalContent: '',
      modalHidden: true
    });
  },
  useridInput: function (e) {
    this.setData({
      otheruserID: e.detail.value,
    });
    if (e.detail.value.length >= 8) {
      wx.hideKeyboard();
    }
  },
})