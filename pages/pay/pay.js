Page({
  data: {
    total: 0,
    addrList: [],
    itemList: [],
    n: 0,
    dft: 0,
    showAddr: false,
    openID: ""
  },
  onLoad: function (options) {
    var that = this;
    getApp().getOpenID(function (id) {
      that.setData({
        openID: id
      })
    })
    this.setData({
      total: options.total
    });
    wx.request({
      url: 'http://www.zhangyuhan.xin/mini-app/data/addrList.php?openID=' + that.data.openID,
      success: function (res) {
        that.setData({
          addrList: res.data
        });
      }
    });
    wx.request({
      url: 'http://www.zhangyuhan.xin/mini-app/data/checkedList.php?openID=' + that.data.openID,
      success: function (res) {
        var num = 0;
        for (var p of res.data) {
          num += p.count - 0;
        }
        that.setData({
          itemList: res.data,
          n: num
        });
      }
    })
  },
  chooseAddr: function () {
    this.setData({
      showAddr: true
    });
  },
  dftAddr: function (e) {
    this.setData({
      showAddr: false,
      dft: e.target.dataset.index
    });
  },
  addAddr: function () {
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
      }
    })
  }
})