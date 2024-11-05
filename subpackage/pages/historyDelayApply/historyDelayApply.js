var app = getApp();
Page({
  data: {
    defaultData: {
      text: "历史延时申请",
      ifShow: false,
    },
    applyInfo: [],
    target: {},
    pageIndex: 0,
    flag: true,
    isLast: false,
  },
  onShow() {
    this.setData({
      applyInfo: [],
      target: {},
      pageIndex: 0,
      flag: true,
      isLast: false,
    });
    this.getInfo();
  },
  getInfo() {
    if (this.data.isLast) {
      wx.showToast({
        title: "已到底",
        icon: "error",
      });
    } else {
      this.setData({
        flag: false,
      });
      let url = app.globalData.apiUrl.queryLmappVisitDelaysWithPage;
      app.func.getRequest_data_session(
        url, {
          pageSize: 7,
          pageIndex: this.data.pageIndex
        },
        (res) => {
          //console.log(res.data.lmappVisitDelays)
          this.setData({
            applyInfo: this.data.applyInfo.concat(res.data.lmappVisitDelays),
            isLast: res.data.page.isLast,
            flag: true,
          });
          // console.log(this.data.applyInfo);
        }
      );
    }
  },
  getMore() {
    if (this.data.flag) {
      this.setData({
        flag: false,
        pageIndex: ++this.data.pageIndex,
      });
      this.getInfo();
    }
  },
  ondetail(e) {
    let mesInfo = e.currentTarget.dataset.index
    // console.log(mesInfo)
    mesInfo.endtime = "1"
    wx.removeStorageSync("yiban");
    wx.setStorageSync("yiban", false);
    wx.removeStorageSync("mesInfo");
    wx.setStorageSync("mesInfo", mesInfo);
    wx.removeStorageSync("visitId");
    wx.setStorageSync("visitId", e.currentTarget.dataset.index.id);
    wx.removeStorageSync("delayId");
    wx.setStorageSync("delayId", e.currentTarget.dataset.index.delayId);
    wx.navigateTo({
      url: "../messageDetail/messageDetail",
    });
  },

});