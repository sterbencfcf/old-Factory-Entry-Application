// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    list: [
      {
        tabNum: 0,
        pagePath: "/pages/handle/handle",
        text: "办理",
        name: "subscriptions",
        icon: "../picture/bottombar/handle.png",
        activeIcon: "../picture/bottombar/handleB.png",
        Selection: "add",
      },
      {
        tabNum: 1,
        pagePath: "/pages/message/message",
        text: "信息",
        name: "profile",
        icon: "../picture/bottombar/message.png",
        activeIcon: "../picture/bottombar/messageB.png"
      },
      {
        tabNum: 2,
        pagePath: "/pages/statistics/statistics",
        text: "统计",
        name: "profile",
        icon: "../picture/bottombar/statistics.png",
        activeIcon: "../picture/bottombar/statisticsB.png"
        //chart-trending-o
      },
      {
        tabNum: 3,
        pagePath: "/pages/usercenter/usercenter",
        text: "我的",
        name: "profile",
        icon: "../picture/bottombar/user.png",
        activeIcon: "../picture/bottombar/userB.png"
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // event.detail 的值为当前选中项的索引
      getApp().globalData.active = event.detail;
      wx.switchTab({
        url: this.data.list[event.detail].pagePath,
      });
    },
  },
});
