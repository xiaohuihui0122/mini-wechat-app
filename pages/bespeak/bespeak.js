// pages/bespeak/bespeak.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID: "",
    dateList: [],
    time: "营业时间 9：00-21：00",
    currentDate: 0,
    isOn: 0,
    barber: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    phone: "",
    isDisabled: false,
    timer: 60,
    code: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://www.zhangyuhan.xin/mini-app/data/getTime.php',
      success: function (res) {
        var time = new Date(res.data);
        var arr = [];
        var nowDate = time.getDate();
        var nowMonth = time.getMonth() + 1;
        var bigMonth = [1, 3, 5, 7, 8, 10, 12];
        var smallMonth = [4, 6, 9, 11];
        var nowYear = time.getFullYear;
        for (let i = 0; i < 2; i++) {
          if (bigMonth.indexOf(nowMonth) >= 0 && nowDate >= 31) { nowDate = 0; nowMonth++; }
          if (smallMonth.indexOf(nowMonth) >= 0 && nowDate >= 30) { nowDate = 0; nowMonth++; }
          if (nowMonth == 2 && nowYear % 4 == 0 && nowDate >= 29) { nowDate = 0; nowMonth++; }
          if (nowMonth == 2 && nowYear % 4 != 0 && nowDate >= 28) { nowDate = 0; nowMonth++; }
          nowDate++;
          arr.push(nowMonth + "月" + nowDate + "日");
        }
        that.setData({
          dateList: arr
        });
      }
    });
    getApp().getOpenID(function (id) {
      that.setData({
        openID: id
      })
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  chooseDate: function (e) {
    this.setData({
      currentDate: parseInt(e.currentTarget.dataset.index)
    })
  },
  chooseBarber: function (e) {
    this.setData({
      isOn: e.target.dataset.index
    })
  },
  btnEvent: function () {
    var that = this;
    wx.request({
      url: 'http://www.zhangyuhan.xin/mini-app/data/phoneCode.php?PhoneNumbers=' + that.data.phone,
      success: function (res) {
        if (res.data.phoneCode != "" && res.data.phoneCode == that.data.code) {
          if (that.data.time != "营业时间 9：00-21：00") {
            wx.request({
              url: 'http://www.zhangyuhan.xin/mini-app/data/bespeak.php?openID=' + that.data.openID + '&phone=' + that.data.phone + '&bDate=' + that.data.dateList[that.data.currentDate] + '&bTime=' + that.data.time + '&barber=' + that.data.barber[that.data.isOn],
              success: function (res) {
                if (res.data.code == 200) {
                  wx.showToast({
                    title: '预约成功',
                    icon: 'success',
                    duration: 2000
                  });
                  setTimeout(function(){
                    wx.navigateBack({
                      delta: 1
                    })
                  },2000);
                } else {
                  wx.showToast({
                    title: '预约失败',
                    icon: 'loading',
                    duration: 2000
                  })
                }
              }
            });
          } else {
            wx.showToast({
              title: '请选择时间',
              icon: 'loading',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '验证码不正确',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    });
  },
  phoneInputEvent: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  codeInputEvent: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function () {
    var that = this;
    if (this.data.phone != "") {
      this.setData({
        isDisabled: true
      });
      setTimeout(function () {
        that.setData({
          isDisabled: false
        });
      }, 60000);
      var timer = setInterval(function () {
        if (that.data.timer > 1)
          that.setData({
            timer: that.data.timer - 1
          });
        else {
          clearInterval(timer);
          that.setData({
            timer: 60
          })
        }
      }, 1000);
      wx.request({
        url: 'http://www.zhangyuhan.xin/mini-app/aliyun-dysms-php-sdk-lite/demo/sendSms.php?PhoneNumbers=' + that.data.phone,
        success: function (res) {
          if (res.data.status == 200) {
            wx.showToast({
              title: '已发送',
              icon: 'success',
              duration: 1000
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'loading',
        duration: 1000
      })
    }
  }
})