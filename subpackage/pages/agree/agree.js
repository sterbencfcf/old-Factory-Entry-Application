Page({
  data: {
    defaultData: {
      text: "知情同意",
      ifShow: false,
    },
    btn_time: 6,
    btn_data: "同意",
    action: "none",
  },
  onShow() {
    this.countdown()
  },
  countdown() {
    if (this.data.btn_time > 1) {
      this.setData({
        btn_time: this.data.btn_time - 1
      })
      setTimeout(this.countdown, 1000);
    } else {
      this.setData({
        btn_time: "",
        action: "auto"
      })
    }
  },
  onCancel() {
    wx.navigateBack({
      delta: 1,
    });
  },
  onAgree() {
    wx.redirectTo({
      url: '../apply/apply',
    })
  }
})