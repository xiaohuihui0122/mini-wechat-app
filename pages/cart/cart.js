// pages/cart/cart.js
Page({
  data: {
    openID: "",
    total: 0,
    cartItems: [],
    checkList: [],
    allChoose: false
  },
  minus: function (e) {
    var that = this;
    wx.request({
      url: 'http://www.zhangyuhan.xin/mini-app/data/cartMinNum.php?openID=' + that.data.openID + '&id=' + e.target.dataset.fid,
      success: function (res) {
        if (res.code == 200) {
          wx.request({
            url: 'http://www.zhangyuhan.xin/mini-app/data/cartList.php?openID=' + that.data.openID,
            success: function (res) {
              for (let p of res.data) {
                if (p.checked == 0) p.checked = false;
                else p.checked = true;
              }
              that.setData({
                cartItems: res.data
              });
            }
          });
        } else if (res.data.code == 402) {
          wx.showToast({
            title: '不能再少了',
            icon: 'loading',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '网络链接失败',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    if (this.data.checkList[e.target.dataset.index])
      this.setData({
        total: this.data.total - this.data.cartItems[e.target.dataset.index].price
      });
  },
  add: function (e) {
    var that = this;
    wx.request({
      url: 'http://www.zhangyuhan.xin/mini-app/data/cartAddNum.php?openID=' + that.data.openID + '&id=' + e.target.dataset.fid,
      success: function (res) {
        wx.request({
          url: 'http://www.zhangyuhan.xin/mini-app/data/cartList.php?openID=' + that.data.openID,
          success: function (res) {
            for (let p of res.data) {
              if (p.checked == 0) p.checked = false;
              else p.checked = true;
            }
            that.setData({
              cartItems: res.data
            });
          }
        });
      }
    });
    if (this.data.checkList[e.target.dataset.index])
      this.setData({
        total: this.data.total + (this.data.cartItems[e.target.dataset.index].price - 0)
      });
  },
  delItem: function () {
    var that = this;
    if (that.data.checkList.indexOf(true) < 0) {
      wx.showToast({
        title: '请选择宝贝',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确认要删除吗',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: 'http://www.zhangyuhan.xin/mini-app/data/checkedList.php?openID=' + that.data.openID,
              success: function (res) {
                for (let p of res.data) {
                  wx.request({
                    url: 'http://www.zhangyuhan.xin/mini-app/data/delCart.php?openID=' + that.data.openID + '&id=' + p.id,
                    success: function (res) {
                      if (res.data.code == 200) {
                        wx.showToast({
                          title: '删除成功',
                          icon: 'success',
                          duration: 2000
                        })
                      } else {
                        wx.showToast({
                          title: '网络连接失败',
                          icon: 'loading',
                          duration: 2000
                        })
                      }
                    }
                  });
                }
                that.init();
              }
            })
          }
        }
      })
    }
  },
  onLoad: function () {
    var that = this;
    getApp().getOpenID(function (id) {
      that.setData({
        openID: id
      })
    })
  },
  onShow: function () {
    this.init();
  },
  init: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://www.zhangyuhan.xin/mini-app/data/initChecked.php?openID=' + that.data.openID,
      success: function (res) {
        wx.request({
          url: 'http://www.zhangyuhan.xin/mini-app/data/cartList.php?openID=' + that.data.openID,
          success: function (res) {
            for (let p of res.data) {
              if (p.checked == 0) p.checked = false;
              else p.checked = true;
            }
            that.setData({
              cartItems: res.data
            });
            var arr = [];
            for (let p of that.data.cartItems) {
              arr.push(false);
            }
            that.setData({
              checkList: arr,
              total: 0,
              allChoose: false
            });
            wx.hideLoading();
          }
        });
      }
    });
  },
  checkEvent: function (e) {
    var that = this;
    wx.request({
      url: 'http://www.zhangyuhan.xin/mini-app/data/updateChecked.php?openID=' + that.data.openID + '&id=' + e.target.dataset.fid,
      success: function (res) {
        if (res.data.code == 200) {
          let arr = that.data.checkList;
          arr[e.target.dataset.index] = arr[e.target.dataset.index] ? false : true;
          that.setData({
            checkList: arr
          });
          if (that.data.checkList.indexOf(false) < 0) {
            var sum = 0;
            for (let p of that.data.cartItems) {
              sum += p.price * p.count;
            }
            that.setData({
              allChoose: true,
              total: sum
            });
          } else {
            that.setData({
              allChoose: false
            });
            if (that.data.checkList[e.target.dataset.index]) {
              that.setData({
                total: that.data.total + that.data.cartItems[e.target.dataset.index].price * that.data.cartItems[e.target.dataset.index].count
              });
            } else {
              that.setData({
                total: that.data.total - that.data.cartItems[e.target.dataset.index].price * that.data.cartItems[e.target.dataset.index].count
              });
            }
          }
        }
      }
    })
  },
  allChooseEvent: function () {
    var that = this;
    if (that.data.checkList.indexOf(false) < 0) {
      wx.request({
        url: 'http://www.zhangyuhan.xin/mini-app/data/allChoose.php?openID=' + that.data.openID + '&checked=false',
        success: function (res) {
          if (res.data.code == 200) {
            var arr = [];
            for (let p of that.data.cartItems) {
              arr.push(false);
            }
            that.setData({
              checkList: arr,
              total: 0
            });
          }
        }
      })
    } else {
      wx.request({
        url: 'http://www.zhangyuhan.xin/mini-app/data/allChoose.php?openID=' + that.data.openID + '&checked=true',
        success: function (res) {
          if (res.data.code == 200) {
            var arr = [];
            for (let p of that.data.cartItems) {
              arr.push(true);
            }
            var sum = 0;
            for (let p of that.data.cartItems) {
              sum += p.price * p.count;
            }
            that.setData({
              total: sum,
              checkList: arr
            });
          }
        }
      })
    }
  },
  goPay: function () {
    if (this.data.total === 0) {
      wx.showToast({
        title: '请选择宝贝',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.navigateTo({ url: '/pages/pay/pay?total=' + this.data.total })
    }
  }
})