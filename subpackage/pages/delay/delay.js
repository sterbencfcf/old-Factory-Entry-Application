var app = getApp();
Page({
  data: {
    defaultData: {
      text: "延时申请",
      ifShow: false,
    },
    lmappVisitEnds: [],
    visitIdList: [],
    visitIdListAll: [],
    visitName: "",
    showVisitIdList: false,
    delayPlace: "",
    showDate: false,
    date: "",
    // maxDate: "",
    // delayBeginDate: "",
    // delayEndDate: "",
    ShowDelayBeginTime: false,
    ShowDelayEndTime: false,
    minHour: "",
    maxHour: 24,
    delayBeginTime: "",
    delayEndTime: "",
    accompanyinyPerson: "",
    telephone: "",
    filter(type, options) {
      if (type === "minute") {
        return options.filter((option) => option % 10 === 0);
      }
      return options;
    },
  },
  onShow() {
    // let visitEndDate = wx.getStorageSync('AD').visitEndDate
    // let maxdata = visitEndDate.split("-");
    // // console.log(maxdata)
    // let maxDate = new Date(
    //   parseInt(maxdata[0]),
    //   parseInt(maxdata[1]) - 1,
    //   parseInt(maxdata[2])
    // ).getTime();
    // console.log(maxDate)
    let date = this.getCurrentDate()
    this.setData({
      date
    })
  },
  // onShowDate() {
  //   this.setData({
  //     showDate: true
  //   });
  // },
  // onCloseShowDate() {
  //   this.setData({
  //     showDate: false
  //   });
  // },
  // 获取当前日期
  getCurrentDate() {
    let date = new Date();
    // 获取年份
    let year = date.getFullYear();
    // 获取月份，注意月份是从0开始的，所以需要加1
    let month = String(date.getMonth() + 1).padStart(2, '0');
    // 获取日期
    let day = String(date.getDate()).padStart(2, '0');
    // 格式化成 YYYY-MM-DD
    return `${year}-${month}-${day}`;
  },
  // formatDate(date) {
  //   date = new Date(date);
  //   return `${date.getMonth() + 1}/${date.getDate()}`;
  // },
  // formatDate2(date) {
  //   date = new Date(date);
  //   return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  // },
  // onConfirmShowDate(event) {
  //   const [start, end] = event.detail;
  //   this.setData({
  //     showDate: false,
  //     date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
  //     delayBeginDate: `${this.formatDate2(start)}`,
  //     delayEndDate: `${this.formatDate2(end)}`,
  //   });
  // },
  onShowDelayBeginTime() {
    this.setData({
      ShowDelayBeginTime: true,
    });
  },
  onCloseDelayBeginTime() {
    this.setData({
      ShowDelayBeginTime: false,
    });
  },
  onDelayBeginTimeConfirm(event) {
    let minHour = event.detail.split(":");
    this.setData({
      delayBeginTime: event.detail,
      minHour: minHour[0],
      ShowDelayBeginTime: false,
    });
  },
  onShowDelayEndTime() {
    this.setData({
      ShowDelayEndTime: true,
    });
  },
  onCloseDelayEndTime() {
    this.setData({
      ShowDelayEndTime: false,
    });
  },
  onDelayEndTimeConfirm(event) {
    let maxHour = event.detail.split(":");
    this.setData({
      delayEndTime: event.detail,
      maxHour: maxHour[0],
      ShowDelayEndTime: false,
    });
  },
  onCancel() {
    wx.showModal({
      title: "确认退出？",
      content: "表单无法保存",
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1,
          });
        }
      },
    });
  },
  onSubmit() {
    var that = this;
    if (
      that.data.delayPlace == '' ||
      that.data.delayBeginDate == '' ||
      that.data.delayEndDate == '' ||
      that.data.delayBeginTime == '' ||
      that.data.delayEndTime == '' ||
      that.data.accompanyinyPerson == '' ||
      that.data.telephone == ''
    ) {
      wx.showToast({
        title: '星号栏不能为空',
        icon: 'error'
      })
    } else if (!app.func.isPhone(that.data.telephone)) {
      wx.showToast({
        title: "手机号格式错误",
        icon: "error",
      });
    } else {
      wx.showModal({
        title: "确认无误?",
        content: "表单无法修改",
        success(res) {
          if (res.confirm) {
            let url = app.globalData.apiUrl.addLmappVisitDelay;
            app.func.postRequest_Data_session(
              url, {
                lmappvisitdelay: {
                  visitId: wx.getStorageSync('AD').id,
                  delayPlace: that.data.delayPlace,
                  delayBeginDate: that.data.date,
                  delayEndDate: that.data.date,
                  delayBeginTime: `${that.data.delayBeginTime}`,
                  delayEndTime: `${that.data.delayEndTime}`,
                  accompanyinyPerson: that.data.accompanyinyPerson,
                  telephone: that.data.telephone,
                },
              },
              (res) => {
                if (Object.keys(res.data).length == 0) {
                  wx.showToast({
                    title: "提交成功",
                    icon: "success",
                    duration: 1000,
                    success() {
                      setTimeout(function () {
                        wx.switchTab({
                          url: "../../../pages/message/message",
                          success() {
                            let page = getCurrentPages().pop();
                            page.refresh1();
                            page.refresh2();
                          },
                        });
                      }, 1000);
                    },
                  });
                } else {
                  wx.showToast({
                    title: "出错了",
                    icon: "error",
                  });
                }
              }
            );
          }
        },
      });
    }

  },
});