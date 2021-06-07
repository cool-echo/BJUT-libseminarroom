//xs.js
//获取应用实例
var app = getApp();
var util = require('../../utils/timeutil.js');
Page({
  data: {
    header: {
      defaultValue: "COMP",
      inputValue: '',
      help_status: false
    },
    main: {
      mainDisplay: true, // main 显示的变化标识
      total: 0,
      sum: 0,
      page: 0,
      message: '加载完成'
    },
    testData: [],
    messageObj: { // 查询失败的提示信息展示对象
      messageDisplay: true,
      message: '' 
    },
    date: util.formatTime(new Date())
  },
  onShareAppMessage: function () {
    return {
      title: 'We-BJUT(一个高效的研讨室预约小工具)',
      
    }
  },

  bindClearSearchTap: function (e) {
    this.setData({
      'main.mainDisplay': true,
      'main.message': '加载完成',
      'header.inputValue': ''
    });
  },

  bindSearchInput: function(e) {
    this.setData({
      'header.inputValue': e.detail.value,

      'main.message': '加载完成',
    });
    // if(!this.data.messageObj.messageDisplay){
    //   this.setData({
    //     'messageObj.messageDisplay': true,
    //     'messageObj.message': ''
    //   });
    // }
    return e.detail.value;
  },

  // 点击搜索
  bindConfirmSearchTap: function () {
    this.setData({
      'main.total': 0,
      'main.sum': 0,
      'main.page': 0,
      'main.message': '上滑加载更多',
      'testData': []
    });
    this.search();
  },

  // 上滑加载更多
  onReachBottom: function(){

  },

  // 搜索
  search: function (key) {
    if(app.globalData.cookies != null){
      
    var that = this,
        inputValue = key || that.data.header.inputValue,
        messageDisplay = false,
        message = '',
        reDdata = null,
        numberSign = false; // 用户输入的是姓名还是学号的标识
      
    // 消除字符串首尾的空格
    function trim(str) {

      return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    inputValue = trim(inputValue);

    // 抽离对messageObj的设置成一个单独的函数
    function setMessageObj(messageDisplay, message) {

      that.setData({
        'messageObj.messageDisplay': messageDisplay,
        'messageObj.message': message
      });
    }


    // 防止注入攻击
    function checkData(v) {

        var temp = v;
          
        v = v.replace(/\\|\/|\.|\'|\"|\<|\>/g, function (str) { return ''; });
        v = trim(v);

        messageDisplay = v.length < temp.length ? false : true;
        message = '请勿输入非法字符!';

        return v;
    }

    // 对输入进行过滤
    inputValue = checkData(inputValue);

    setMessageObj(messageDisplay, message);
    this.setData({
       'header.inputValue': inputValue
    });

    // 存在非法输入只会提示错误消息而不会发送搜索请求
    if (messageDisplay === false) { 
      return false;
    }

    // 对输入类型进行处理 inputValue:String
    if (!isNaN(parseInt(inputValue, 10))) {

      numberSign = true;
    }

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
            'main.mainDisplay': true,
            'main.total': that.data.testData.length,
            'main.sum': that.data.testData.length,
            'messageObj.messageDisplay': messageDisplay,
            'main.message': '上滑加载更多'
          });

        }
      });


      wx.hideToast();

      if(data.total <= that.data.main.sum) {
        that.setData({
          'main.message': '已全部加载'
        });
      }
    }
    
    // 处理没找到搜索到结果或错误情况
    function doFail(err) {

      var message = typeof err === 'undefined' ? '未搜索到相关结果' : err;
      
      setMessageObj(false, message);
      wx.hideToast();
    }
    
    that.setData({
      'main.message': '加载完成',
      'main.page': that.data.main.page + 1
    });
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
    
    
    //this.setData(data);
    // wx.downloadFile({
    //   url:this.data.testData[index].attributes.url,
    //   success: function (res) {
    //     var filePath = res.tempFilePath;
    //     wx.openDocument({
    //       filePath: filePath,
    //     });
    //     wx.hideToast();
    //   },
    // });

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
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
  }

    // if(this.data.testData.length == 0)
    //   this.search()
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

  onPullDownRefresh: function(){
    this.data.testData = []
    this.search()
  },


  tapHelp: function(e){
    if(e.target.id == 'help'){
      this.hideHelp();
    }
  },
  showHelp: function(e){
    this.setData({
      'header.help_status': true
    });
  },
  hideHelp: function(e){
    this.setData({
      'header.help_status': false
    });
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
