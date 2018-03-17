Page({
  data: {
    slider: [
      { picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000000rVobR3xG73f.jpg' },
      { picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000000j6Tax0WLWhD.jpg' },
      { picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000000a4LLK2VXxvj.jpg' }
    ],
    sidebaritems: [
      { name: '主食' },
      { name: '甜点' },
      { name: '咖啡' },
      { name: '零食' },
      { name: '套餐' }
    ],
    swiperCurrent: 0,
    sidebarCurrent: 0,
    scrollTop: 0,
    floorstatus: false,
    record: {},
    openID: "",
    countArr: []
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e) {
    if (e.detail.scrollTop > 50) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  getCoupon: function () {
    wx.showToast({
      title: '领取优惠券成功',
      icon: 'success',
      duration: 2000
    })
  },
  confirm: function () {
    this.setData({
      hidden: true
    });
  },
  addCart: function (e) {
    var that = this;
    wx.request({
      url: 'http://www.zhangyuhan.xin/mini-app/data/addCart.php?openID=' + that.data.openID + '&id=' + e.target.dataset.fid + '&count=' + that.data.countArr[e.target.dataset.fid],
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '加入购物车失败',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    });
  },
  sidebarEvent: function (e) {
    this.setData({
      sidebarCurrent: e.target.dataset.index
    });
  },
  getMore: function () { },
  onShareAppMessage: function () {
    return {
      title: '自助点餐神器',
      desc: '餐饮点餐神器,一款功能强大的小程序',
      path: '/pages/index/index'
    }
  },
  minus: function (e) {
    var arr = this.data.countArr;
    if (arr[e.target.dataset.fid] > 1)
      arr[e.target.dataset.fid]--;
    this.setData({
      countArr: arr
    });
  },
  add: function (e) {
    var arr = this.data.countArr;
    arr[e.target.dataset.fid]++;
    this.setData({
      countArr: arr
    });
  },
  goDetail: function (e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.target.dataset.fid })
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'http://www.zhangyuhan.xin/mini-app/data/foodList.php',
      success: function (res) {
        that.setData({
          record: res.data
        });
        var arr = [];
        for (var key in res.data) {
          for (let p of res.data[key]) {
            arr.push(1);
          }
        }
        that.setData({
          countArr: arr
        });
      }
    });
    getApp().getOpenID(function (id) {
      that.setData({
        openID: id
      })
    })
  }
})