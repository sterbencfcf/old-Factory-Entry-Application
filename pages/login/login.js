// pages/login/login.js
var app = getApp();
Page({
  data: {
    // 19901182
    // 000000
    userId: "",
    password: "",
  },
  onLoad(){
    let userId=wx.getStorageSync('userId')
    this.setData({
      userId:userId
    })
    // console.log(this.data.userId)
  },
  goRegister() {
    wx.navigateTo({
      url: "/pages/register/register",
    });
  },
  loginForm(data) {
    this.setData({
      userId: data.detail.value.userId,
      password: data.detail.value.password,
    });
    let url = app.globalData.apiUrl.lmappLogin;
    app.func.loginFunc(
      url, {
        userId: this.data.userId,
        password: this.data.password
      },
      (res) => {
        //console.log(res.data)
        wx.setStorageSync('userId', this.data.userId)
        if (res.data.errorCode == 100000) {
          app.globalData.userId = this.data.userId;
          wx.switchTab({
            url: "/pages/handle/handle",
          });
        } else if (res.data.errorCode == 200001) {
          wx.showToast({
            title: "用户不存在",
            icon: "error",
          });
        } else if (res.data.errorCode == 200002) {
          wx.showToast({
            title: "帐号或密码错误",
            icon: "error",
          });
        } else if (res.data.errorCode == 200003) {
          wx.showToast({
            title: "数据库连接失败",
            icon: "error",
          });
        } else if (res.data.errorCode == 200004) {
          wx.showToast({
            title: "因其他原因失败",
            icon: "error",
          });
        } else if (res.data.errorCode == 200005) {
          wx.showToast({
            title: "请先完成注册",
            icon: "error",
          });
        }
      }
    );
  },
});