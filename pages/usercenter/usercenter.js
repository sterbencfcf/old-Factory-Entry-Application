var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      text: "我的",
      ifShow: true,
    },
    show: false,
    userInfo: {},
  },
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        active: 3,
      });
    }
  },
  onLoad() {
    this.setData({ userInfo: wx.getStorageSync("userInfo") });
  },
  goMyInfo() {
    wx.navigateTo({
      url: "../../subpackage/pages/myInfo/myInfo",
    });
  },
  goChangePassword() {
    wx.navigateTo({
      url: "../../subpackage/pages/changePassword/changePassword",
    });
  },
  logout() {
    let url = app.globalData.apiUrl.lmapplogout;
    app.func.getRequest_session(url, (res) => {
      // console.log(res.data);
      if (
        !(res.data.UserObject == undefined || res.data.UserObject.length <= 0)
      ) {
        wx.removeStorageSync("sessionid");
        wx.removeStorageSync("userInfo");
        app.globalData.userId = "";
        wx.reLaunch({
          url: "/pages/login/login",
        });
      }
    });
  },
});
