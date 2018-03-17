// pages/address/address.js
Page({
  data: {
    openID: "",
    addrList: [],
    isShow: false
  },
  addAddr: function () {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        wx.request({
          url: 'http://www.zhangyuhan.xin/mini-app/data/addAddr.php?openID=' + that.data.openID + '&uname=' + res.userName + '&phone=' + res.telNumber + '&province=' + res.provinceName + '&city=' + res.cityName + '&area=' + res.countyName + '&address=' + res.detailInfo,
          success: function (res) {
            if (res.data.code == 200) {
              wx.request({
                url: 'http://www.zhangyuhan.xin/mini-app/data/addrList.php?openID=' + that.data.openID,
                success: function (res) {
                  that.setData({
                    addrList: res.data
                  });
                }
              })
            }
          }
        })
      }
    })
  },
  delAddr: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'http://www.zhangyuhan.xin/mini-app/data/delAddr.php?openID=' + that.data.openID + '&aid=' + e.target.dataset.aid,
            success: function (res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'loading',
                  duration: 2000
                })
              }
              wx.request({
                url: 'http://www.zhangyuhan.xin/mini-app/data/addrList.php?openID=' + that.data.openID,
                success: function (res) {
                  that.setData({
                    addrList: res.data
                  });
                }
              })
            }
          })
        }
      }
    })
  },
  editAddr: function (e) {
    this.setData({
      isShow: true
    });
  },
  cancelEvent: function () {
    this.setData({
      isShow: false
    });
  },
  onLoad: function (options) {
    var that = this;
    getApp().getOpenID(function (id) {
      that.setData({
        openID: id
      })
    })
    wx.request({
      url: 'http://www.zhangyuhan.xin/mini-app/data/addrList.php?openID=' + that.data.openID,
      success: function (res) {
        that.setData({
          addrList: res.data
        });
      }
    })
  }
})