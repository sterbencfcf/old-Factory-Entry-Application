// pages/statistics/statistics.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      text: "统计",
      ifShow: true,
    },
  },

  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        active: 2,
      });
    }
  },

});
