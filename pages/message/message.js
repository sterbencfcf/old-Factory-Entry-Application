var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      text: "信息",
      ifShow: true,
    },
    height_tab: app.globalData.height_tab + 29,
    triggered1: true,
    triggered2: true,
    ToDosInfo: [],
    pageIndex1: 0,
    flag1: true,
    isLast1: false,
    DonesInfo: [],
    pageIndex2: 0,
    flag2: true,
    isLast2: false,
  },
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        active: 1,
      });
    }
  },
  onLoad() {
    this.setData({
      flag1: true,
      flag2: true,
      isLast1: false,
      isLast2: false,
      pageIndex1: 0,
      pageIndex2: 0,
    });
    this.getInfo1();
    this.getInfo2();
  },
  getInfo1() {
    if (this.data.isLast1) {
      wx.showToast({
        title: "已到底",
        icon: "error",
      });
    } else {
      this.setData({
        flag1: false,
      });
      let url = app.globalData.apiUrl.queryLmappToDo;
      app.func.getRequest_data_session(
        url, {
          pageSize: 8,
          pageIndex: this.data.pageIndex1
        },
        (res) => {
          // console.log(res.data);
          this.setData({
            ToDosInfo: this.data.ToDosInfo.concat(res.data.lmappToDos),
            isLast1: res.data.page.isLast,
            flag1: true,
          });
        }
      );
    }
  },
  getInfo2() {
    if (this.data.isLast2) {
      wx.showToast({
        title: "已到底",
        icon: "error",
      });
    } else {
      this.setData({
        flag2: false,
      });
      let url = app.globalData.apiUrl.queryLmappHaveDone;
      app.func.getRequest_data_session(
        url, {
          pageSize: 6,
          pageIndex: this.data.pageIndex2
        },
        (res) => {
          // console.log(res.data);
          this.setData({
            DonesInfo: this.data.DonesInfo.concat(res.data.lmappHaveDones),
            isLast2: res.data.page.isLast,
            flag2: true,
          });
        }
      );
    }
  },
  //用户下拉动作
  refresh1() {
    var that = this;
    this.setData({
      flag1: true,
      isLast1: false,
      pageIndex1: 0,
      ToDosInfo: [],
    });
    this.getInfo1();
    setTimeout(function () {
      that.setData({
        triggered1: false,
      });
    }, 1500);
  },
  refresh2() {
    var that = this;
    this.setData({
      flag2: true,
      isLast2: false,
      pageIndex2: 0,
      DonesInfo: [],
    });
    this.getInfo2();
    setTimeout(function () {
      that.setData({
        triggered2: false,
      });
    }, 1500);
  },
  getMore1() {
    if (this.data.flag1) {
      this.setData({
        flag1: false,
        pageIndex1: ++this.data.pageIndex1,
      });
      this.getInfo1();
    }
  },
  getMore2() {
    if (this.data.flag2) {
      this.setData({
        flag2: false,
        pageIndex2: ++this.data.pageIndex2,
      });
      this.getInfo2();
    }
  },
  showMessage(e) {
    // console.log(e.currentTarget.dataset.index);
    wx.removeStorageSync("yiban");
    wx.setStorageSync("yiban", false);
    wx.removeStorageSync("currentstate");
    wx.removeStorageSync("mesInfo");
    wx.setStorageSync("mesInfo", e.currentTarget.dataset.index);
    wx.removeStorageSync("visitId");
    wx.setStorageSync("visitId", e.currentTarget.dataset.index.visitId);
    wx.removeStorageSync("delayId");
    wx.setStorageSync("delayId", e.currentTarget.dataset.index.delayId);
    wx.navigateTo({
      url: "../../subpackage/pages/messageDetail/messageDetail",
    });
  },
});