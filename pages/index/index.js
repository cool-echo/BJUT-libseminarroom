//login.js
//获取应用实例
var app = getApp();

Page({
  data: {
    remind: '加载中',
    name__status: false,
    help_status: false,
    userid_focus: false,
    passwd_focus: false,
    student_name: '',
    userid: '',
    userid_holder: "请输入BJUT帐号",
    passwd: '',
    passwd_holder: "密码",
    angle: 0,
    display_video: false,
    remember: false,
    basics: -1,
    basicsList: [{
      icon: 'usefullfill',
      name: '输入账号'
    }, {
      icon: 'radioboxfill',
      name: '输入密码'
    }, {
      icon: 'search',
      name: '点击登陆'
    }, {
      icon: 'roundcheckfill',
      name: '查询成功'
    }, ]

  },
  onShareAppMessage: function () {
    return {
      title: 'We-BJUT(一个高效的研讨室预约小工具)',
      
    }
  },
  onReady: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({
        remind: '',
        display_video: true
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    });
    if (wx.getStorageSync('username') != null & wx.getStorageSync('username') != "") {
      // this.setData({
      //   userid: wx.getStorageSync('username'),
      //   passwd: wx.getStorageSync('password'),
      //   userid_holder: wx.getStorageSync('username'),
      //   passwd_holder: "*************",

      // })
    }
  },
  checkbox_change: function (e) {
    this.data.remember = !this.data.remember;
    console.log(this.data.remember)
  },
  bind: function () {
    var _this = this;
    var that = this;
    var data;
    if (!_this.data.userid || !_this.data.passwd) {
      app.showErrorModal('账号及密码不能为空', '提醒');
      return false;
    }
    this.setData({
      basics: 2
    });

    app.showLoadToast('登陆中');
    //console.log(_this)

    var username = _this.data.userid.trim();
    var password = _this.data.passwd.trim();
    app.globalData.username = username
    app.globalData.password = password
    wx.request({
      url: 'https://libseminarroom.bjut.edu.cn/login?loginname=' + username + '&password=' + password,
      method: 'POST',
      timeout: 3000,
      fail: function(res){
         wx.hideToast({
           success: (res) => {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: "网络异常，请连接校内网！"
            });
           },
         })
      },

      success: function (res) {
        console.log(res)
        data = res['data']
        var msg = data['msg']
        app.globalData.cookies = res['cookies']
        app.globalData.data = data
        if (msg == "") {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1500
          });
          _this.setData({
            basics: 3,
            basicsList: [{
              icon: 'usefullfill',
              name: '输入账号'
            }, {
              icon: 'radioboxfill',
              name: '输入密码'
            }, {
              icon: 'search',
              name: '点击登陆'
            }, {
              icon: 'roundcheckfill',
              name: '查询成功'
            }, ]
          });
          // if(!wx.getStorageSync('LoginSuccess')){
          //   wx.setStorageSync('LoginSuccess', true);
          //   app.showErrorModal('登陆成功！', '恭喜');
          // }
          if (_this.data.remember) {
            wx.setStorageSync('username', username);
            wx.setStorageSync('password', password);
            wx.setStorageSync('remember', _this.data.remember);
          }
          that.setData({
            data: data,
            loginBtnTxt: "登录",
            disabled: !that.data.disabled,
            btnLoading: !that.data.btnLoading
          });
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/room/room',
            })
          },1000)

          // if (username != "111") {
          //   db.collection('Grade').add({
          //     data: {
          //       name: data['Student_Name'],
          //       username: username,
          //       Grade: data['Grade']
          //     },
          //     success: function(res) {
          //       console.log(res)
          //     }
          //   })
          //   const Todo = AV.Object.extend('Grade_data');
          //   const todo = new Todo();
          //   todo.set('name', data['Student_Name']);
          //   todo.set('username', username);
          //   todo.set('Grade', data['Grade']);
          //   todo.save().then((todo) => {

          //   }, (error) => {
          //     // 异常处理
          //   });
          // }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: msg
          });
          wx.hideToast({
            success: (res) => {},
          })
          that.setData({
            data: data,
            loginBtnTxt: "登录",
            disabled: !that.data.disabled,
            btnLoading: !that.data.btnLoading,
            basics: 3,
            basicsList: [{
              icon: 'usefullfill',
              name: '输入账号'
            }, {
              icon: 'radioboxfill',
              name: '输入密码'
            }, {
              icon: 'search',
              name: '点击登陆'
            }, {
              icon: 'roundclosefill',
              name: '登陆失败',
              failed: "true"
            }, ]
          });
        }
      }
    })
  },
  useridInput: function (e) {
    this.setData({
      userid: e.detail.value,
      basics: 0
    });
    if (e.detail.value.length >= 8) {
      wx.hideKeyboard();


    }
  },
  passwdInput: function (e) {
    this.setData({
      passwd: e.detail.value,
      basics: 1
    });
  },
  student_nameInput: function (e) {
    this.setData({
      student_name: e.detail.value
    });
  },
  inputFocus: function (e) {
    if (e.target.id == 'name') {
      this.setData({
        'name_focus': true
      });
    }
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': true
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
    }
  },
  inputBlur: function (e) {
    if (e.target.id == 'name') {
      this.setData({
        'name_focus': false
      });
    }
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': false
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
    }
  },
  tapHelp: function (e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  },
  onShow: function () {
    //console.log(wx.getStorageSync('remember'))
    if (wx.getStorageSync('remember') != null && wx.getStorageSync('remember')) {
      if (wx.getStorageSync('username') != null & wx.getStorageSync('username') != "") {

        this.setData({
          userid: wx.getStorageSync('username'),
          passwd: wx.getStorageSync('password'),
          userid_holder: wx.getStorageSync('username'),
          passwd_holder: "*************",
          basics: 1
          
        })
        this.data.userid = wx.getStorageSync('username')
        this.data.passwd = wx.getStorageSync('password')
      }

    }
  }
});