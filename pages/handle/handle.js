var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      text: "办理",
      ifShow: true,
    },
    currentIndex: 0,
  },
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        active: 0,
      });
    }
  },
  onLoad() {
    let that = this
    let url = app.globalData.apiUrl.getUserInfo;
    app.func.getRequest_session(url, (res) => {
      wx.setStorageSync("userInfo", res.data.userInfo);
      // console.log(res.data)
    });
    wx.showModal({
      title: '提示',
      content: '为能实时收到申请通知，请同意订阅接收消息（勾选流程审批通知，并总是保持以上选择）',
      confirmText: "同意",
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          //调用订阅消息
          // console.log('用户点击确定');
          //调用订阅
          that.requestSubscribe();
        } else if (res.cancel) {
          // console.log('用户点击取消');
          ///显示第二个弹说明一下
          wx.showModal({
            title: '温馨提示',
            content: '拒绝后您将无法实时收到申请通知',
            confirmText: "知道了",
            showCancel: false,
            success: function (res) {
              ///点击知道了的后续操作 
              ///如跳转首页面 
            }
          });
        }
      }
    });

  },
  ///发起消息订阅
  requestSubscribe() {
    wx.requestSubscribeMessage({
      tmplIds: ['b6cupROz-dtHZ6UiPHglphYnzOF5k1Zf8r1-BtmsYx4'],
      success: (res) => {
        // console.log("订阅消息 成功 " + res);
      },
      fail: (errCode, errMessage) => {
        // console.log("订阅消息 失败 " + errCode + " message " + errMessage);
      },
      complete: (errMsg) => {
        // console.log("订阅消息 完成 " + errMsg);
      }
    });
  },
  handleChange(e) {
    this.setData({
      currentIndex: e.detail.current,
    });
  },
  onClick(e) {
    var $id = e.target.dataset.index;
    if ($id == 0) {
      wx.navigateTo({
        url: "../../subpackage/pages/agree/agree",
      });
    } else if ($id == 1) {
      wx.navigateTo({
        url: "../../subpackage/pages/delayChoose/delayChoose",
      });
    } else if ($id == 2) {
      wx.navigateTo({
        url: "../../subpackage/pages/externalPersonInfo/externalPersonInfo",
      });
    } else if ($id == 3) {
      wx.navigateTo({
        url: "../../subpackage/pages/historyApply/historyApply",
      });
    } else if ($id == 4) {
      wx.navigateTo({
        url: "../../subpackage/pages/historyDelayApply/historyDelayApply",
      });
    }
  },
});