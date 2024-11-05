const app = getApp();
Component({
  properties: {
    default_data: Object,
  },
  data: {
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuBotton: app.globalData.menuBottom,
    menuHeight: app.globalData.menuHeight,
  },
  attached: function () {},
  methods: {
    back() {
      wx.navigateBack({
        url: "1",
      });
    },
  },
});
