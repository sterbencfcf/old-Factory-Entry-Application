// pages/login/login.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 19901182
    // 000000
    choose: 0,
    // getRequest: 0,
    // orgShow: false,
    // org: "",
    orgDetail: "",
    userId: "",
    password: "",
    telephone: "",
    company: "",
    userName: "",
    // orgColumns: [],
    weixinId: "default",
    id1: "",
    id2: "",
    envVersion: "",
  },
  onLoad() {
    const accountInfo = wx.getAccountInfoSync(); // develop  	开发版 
    // console.log(accountInfo.miniProgram.envVersion)
    this.setData({
      envVersion: accountInfo.miniProgram.envVersion,
      // envVersion: "release"
    })
  },
  goBack() {
    wx.navigateBack({
      delta: 1,
    });
  },
  onShow() {
    wx.login({
      success: (res) => {
        app.globalData.openid = res.code;
      },
    });
  },
  choose(e) {
    // if (e.target.dataset.id == 1) {
    //   this.setData({
    //     org: ""
    //   });
    // }
    // if (e.target.dataset.id == 1 && this.data.getRequest == 0) {
    //   let url = app.globalData.apiUrl.lmappQueryOrg;
    //   app.func.getRequest(url, (res) => {
    //     let orgs = res.data.orgs.map((item) => {
    //       return item.deptName;
    //     });
    //     this.setData({
    //       orgColumns: orgs,
    //       getRequest: this.data.getRequest + 1,
    //     });
    //   });
    // }
    this.setData({
      choose: e.target.dataset.id,
    });
  },
  chooseAgain() {
    wx.navigateTo({
      url: "/pages/login/login",
    });
    // this.setData({
    //   choose: 0,
    // });
  },
  // showOrgPopup() {
  //   this.setData({
  //     orgShow: true
  //   });
  // },
  // onOrgClose() {
  //   this.setData({
  //     orgShow: false
  //   });
  // },
  // onOrgConfirm(e) {
  //   this.setData({
  //     org: e.detail.value,
  //     orgShow: false,
  //   });
  // },
  insideForm(data) {
    // console.log(data.detail.value.org);
    if (
      // data.detail.value.org == "" ||
      data.detail.value.orgDetail == "" ||
      data.detail.value.userId == "" ||
      data.detail.value.telephone == "" ||
      data.detail.value.password == ""
    ) {
      wx.showToast({
        title: "请勿留空",
        icon: "error",
      });
    } else if (!app.func.isPhone(data.detail.value.telephone)) {
      wx.showToast({
        title: "手机号有误",
        icon: "error",
      });
    } else if (
      !this.checkPassword(
        data.detail.value.password,
        data.detail.value.passwordAgain
      )
    ) {
      wx.showToast({
        title: "密码不一致",
        icon: "error",
      });
    } else {
      this.setData({
        orgDetail: data.detail.value.orgDetail,
        userId: data.detail.value.userId,
        telephone: data.detail.value.telephone,
        password: data.detail.value.password,
      });
      let url = app.globalData.apiUrl.lmappRegister;
      let openid = app.globalData.openid;
      app.func.postRequest_Data(
        url, {
          user: {
            userId: this.data.userId,
            telephone: this.data.telephone,
            password: this.data.password,
            // org: this.data.org,
            orgDetail: this.data.orgDetail,
            weixinId: openid,
          },
        },
        (res) => {
          // console.log(res.data.errorCode);
          if (res.data.errorCode == 100000) {
            wx.navigateTo({
              url: '/pages/login/login',
              success() {
                wx.showModal({
                  title: '注册成功',
                  confirmText: "确认",
                  showCancel: false,
                })
              }
            })
          } else if (res.data.errorCode == 201002) {
            wx.showToast({
              title: "手机号已被注册",
              icon: "error",
            });
          } else if (res.data.errorCode == 201003) {
            wx.showToast({
              title: "胸卡号有误",
              icon: "error",
            });
          } else if (res.data.errorCode == 201004) {
            wx.showToast({
              title: "胸卡号已注册",
              icon: "error",
            });
          } else if (res.data.errorCode == 201006) {
            wx.showToast({
              title: "备案手机号有误",
              icon: "error",
            });
          } else {
            wx.showToast({
              title: "出错了",
              icon: "error",
            });
            console.log(res.data)
          }
        }
      );
    }
  },
  outsideForm(data) {
    if (
      data.detail.value.userName == "" ||
      data.detail.value.company == "" ||
      data.detail.value.userId == "" ||
      data.detail.value.telephone == "" ||
      data.detail.value.password == ""
    ) {
      wx.showToast({
        title: "请勿留空",
        icon: "error",
      });
    } else if (!app.func.isPhone(data.detail.value.telephone)) {
      wx.showToast({
        title: "手机号有误",
        icon: "error",
      });
    } else if (!app.func.isCard(data.detail.value.userId)) {
      wx.showToast({
        title: "身份证号有误",
        icon: "error",
      });
    } else if (
      !this.checkPassword(
        data.detail.value.password,
        data.detail.value.passwordAgain
      )
    ) {} else {
      this.setData({
        userName: data.detail.value.userName,
        company: data.detail.value.company,
        userId: data.detail.value.userId,
        telephone: data.detail.value.telephone,
        password: data.detail.value.password,
      });
      let url = app.globalData.apiUrl.lmappRegisterExternal;
      let openid = app.globalData.openid;
      // console.log(openid)
      app.func.postRequest_Data(
        url, {
          user: {
            userName: this.data.userName,
            company: this.data.company,
            userId: this.data.userId,
            telephone: this.data.telephone,
            password: this.data.password,
            weixinId: openid,
          },
        },
        (res) => {
          // console.log(res.data)
          if (res.data.errorCode == 100000) {
            wx.navigateTo({
              url: '/pages/login/login',
              success() {
                wx.showModal({
                  title: '注册成功',
                  confirmText: "确认",
                  showCancel: false,
                })
              }
            })
          } else if (res.data.errorCode == 201001) {
            wx.showToast({
              title: "身份证已注册",
              icon: "error",
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
  checkPassword(pw1, pw2) {
    if (pw1 == pw2) {
      return true;
    } else {
      wx.showToast({
        title: "两次密码不一致",
        icon: "error",
      });
      return false;
    }
  },
});