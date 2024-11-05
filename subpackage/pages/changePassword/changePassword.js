var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      text: "修改密码",
      ifShow: false,
    },
    oldPs: "",
    newPs: "",
    againNewPs: "",
  },
  changePasswordForm(data) {
    if (
      data.detail.value.oldPs == "" ||
      data.detail.value.newPs == "" ||
      data.detail.value.againNewPs == ""
    ) {
      wx.showToast({
        title: "不能为空",
        icon: "error",
      });
    } else if (data.detail.value.oldPs == data.detail.value.newPs) {
      wx.showToast({
        title: "新旧密码相同",
        icon: "error",
      });
    } else if (data.detail.value.againNewPs !== data.detail.value.newPs) {
      wx.showToast({
        title: "两次密码不一致",
        icon: "error",
      });
    } else {
      this.setData({
        oldPs: data.detail.value.oldPs,
        newPs: data.detail.value.newPs,
        againNewPs: data.detail.value.againNewPs,
      });
      let url = app.globalData.apiUrl.lmappUpdatePassword;
      app.func.getRequest_data(
        url,
        {
          password: this.data.oldPs,
          passwordNew: this.data.newPs,
          userId: app.globalData.userId,
        },
        (res) => {
          if (res.data.errorCode == 100000) {
            wx.showToast({
              title: "修改成功",
              icon: "success",
            });
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              });
            }, 1000);
          } else {
            wx.showToast({
              title: "修改错误",
              icon: "error",
            });
          }
        }
      );
    }
  },
});
