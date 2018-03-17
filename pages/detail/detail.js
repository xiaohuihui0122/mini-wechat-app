// pages/detail/detail.js
Page({
  data: {
    recode:{},
    count:1,
    fid:0,
    openID:"",
    num:0
  },
  addCart: function (e) {
    var that = this;
    wx.request({
      url: 'http://zhangyuhan.xin/mini-app/data/addCart.php?openID=' + that.data.openID + '&id=' +that.data.fid + '&count=' + that.data.count,
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '加入购物车失败',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
  },
  minus: function (){
    var num = this.data.count-1;
    if (this.data.count > 1)
    this.setData({
      count: num
    });
  },
  add: function () {
    var num = this.data.count+1;
    this.setData({
      count: num
    });
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      fid:options.id
    });
    wx.request({
      url: 'http://zhangyuhan.xin/mini-app/data/detail.php?id=' + options.id,
      success: function (res) {
        that.setData({
          record: res.data
        });
      }
    })
    getApp().getOpenID(function (id) {
      that.setData({
        openID: id
      })
    })
  }
})