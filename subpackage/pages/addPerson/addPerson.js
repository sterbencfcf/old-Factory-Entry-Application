var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      text: "新增人员",
      ifShow: false,
    },
    id: "",
    name: "",
    sex: "",
    age: "",
    telephone: "",
    identityCardNum: "",
    isDriver: "",
    carLicenseNum: "",
    sexColumns: ["男", "女"],
    sexShow: false,
    driColumns: ["否", "是"],
    driShow: false,
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
  showSexPopup() {
    this.setData({
      sexShow: true
    });
  },

  onSexClose() {
    this.setData({
      sexShow: false
    });
  },
  onSexConfirm(event) {
    this.setData({
      sex: event.detail.value,
      sexShow: false
    });
  },

  onSexCancel() {
    this.setData({
      sexShow: false
    });
  },
  showDriPopup() {
    this.setData({
      driShow: true
    });
  },

  onDriClose() {
    this.setData({
      driShow: false
    });
  },
  onDriConfirm(event) {
    this.setData({
      isDriver: event.detail.value,
      driShow: false
    });
  },

  onDriCancel() {
    this.setData({
      driShow: false
    });
  },
  submit() {
    //console.log(app.func.isCarNum("粤E51J51"))
    //console.log(typeof this.data.age)
    //console.log(this.data.age < 10)
    if (
      this.data.name == "" ||
      this.data.sex == "" ||
      this.data.age == "" ||
      this.data.telephone == "" ||
      this.data.identityCardNum == "" ||
      this.data.isDriver == ""
    ) {
      wx.showToast({
        title: "星号栏不能为空",
        icon: "error",
      });
    } else if (!(this.data.age > 0 && this.data.age < 110 && this.data.age % 1 === 0)) {
      wx.showToast({
        title: "无效年龄",
        icon: "error",
      });
    } else if (!app.func.isPhone(this.data.telephone)) {
      wx.showToast({
        title: "手机号格式错误",
        icon: "error",
      });
    } else if (!app.func.isCard(this.data.identityCardNum)) {
      wx.showToast({
        title: "身份证格式错误",
        icon: "error",
      });
    } else if (this.data.isDriver == "是" && this.data.carLicenseNum == "") {
      wx.showToast({
        title: "请填写车牌号",
        icon: "error",
      });
    } else if (this.data.isDriver == "是" && (!app.func.isCarNum(this.data.carLicenseNum))) {
      wx.showToast({
        title: "请输入正确车牌号",
        icon: "error",
      });
    } else {
      let url = app.globalData.apiUrl.addLmappExternalPerson;
      app.func.postRequest_Data_session(
        url, {
          lmappexternalperson: {
            id: this.data.id,
            name: this.data.name,
            sex: this.data.sex == "男" ? "m" : "f",
            age: this.data.age,
            telephone: this.data.telephone,
            identityCardNum: this.data.identityCardNum,
            isDriver: this.data.isDriver == "否" ? 0 : 1,
            carLicenseNum: this.data.carLicenseNum,
          },
        },
        (res) => {
          if (res.data.errorCode == 100000) {
            wx.showToast({
              title: "添加成功",
              icon: "success",
              duration: 1000,
              success() {
                let pages = getCurrentPages();
                let prePage = pages[pages.length - 2];
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                    success() {
                      prePage.onLoad();
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