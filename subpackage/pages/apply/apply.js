var app = getApp();
Page({
  data: {
    defaultData: {
      text: "填写申请",
      ifShow: false,
    },
    btn_data: {
      btn1: "取消",
      btn2: "提交",
    },
    searchWord: "",
    showReceptionist: false,
    receptionist: "",
    // receptionistPhone: "",
    receptionistInfo: {},
    receptionistList: [],
    receptionistListAll: [],
    showVisitReason: false,
    createByDept: "",
    visitorCompany: "",
    isForeigner: "",
    foreignerColumns: ["否", "是"],
    foreigneShow: false,
    VisitReasonList: [
      "技术交流",
      "施工",
      "提送货",
      "排残",
      "安装调试",
      "业务洽谈",
    ],
    VisitReason: {
      reason: "",
      index: "",
    },
    date: "",
    visitBeginDate: "",
    visitEndDate: "",
    showDate: false,
    wPersonsList: [],
    result: [],
    chooseWPersonsList: [],
    lmappVisitExternalPersons: [],
    placeChoose: '',
    activityPath: "",
    showAddPerson: false,
    carryObject: "",
    // envVersion: "",
    errorMessage: '请申请“外籍单位人员来访审批流程”后使用OA网内“中国航发沈阳黎明接待当日外来人员审批流程”进行申请',
    maxDate: ""
  },
  // onLoad() {
  //   const accountInfo = wx.getAccountInfoSync(); // develop  	开发版 
  //   // console.log(accountInfo.miniProgram.envVersion)
  //   this.setData({
  //     envVersion: accountInfo.miniProgram.envVersion,
  //     // envVersion: "release"
  //   })
  // },
  onShow() {
    let nowDat = new Date();
    let dateY = nowDat.getFullYear();
    let dateM = nowDat.getMonth();
    let dateD = nowDat.getDate();
    //日历可选范围为一年，dateY + 1
    let maxDate = new Date(dateY, dateM, dateD + 30).getTime();
    let url = app.globalData.apiUrl.queryLmappExternalPersonsWithoutPage;
    app.func.getRequest_session(url, (res) => {
      this.setData({
        maxDate,
        wPersonsList: res.data.lmappExternalPersons,
        createByDept: wx.getStorageSync("userInfo").department,
      });
      // console.log(this.data.wPersonsList);
    });
  },
  onClickReceptionist() {
    this.setData({
      showReceptionist: true,
      receptionist: "",
      // receptionistPhone: "",
    });
  },
  onCloseReceptionist() {
    this.setData({
      showReceptionist: false,
    });
  },
  onReceptionistConfirm(e) {
    let name = e.detail.value.split("-");
    let receptionistInfo = this.data.receptionistListAll.find((item) => {
      return item.receptionistName == name[0];
    });
    this.setData({
      receptionist: e.detail.value,
      // receptionistPhone: receptionistInfo.receptionistTelephone,
      receptionistInfo,
      showReceptionist: false,
    });
  },
  onSearch(e) {
    if (e.detail !== "") {
      const value = e.detail;
      clearTimeout(this.timeId); //清除定时器
      this.timeId = setTimeout(() => {
        this.search(value); //发送请求，间隔时间为1s
      }, 1000);
    }
  },
  search() {
    // let url = app.globalData.apiUrl.getReceptionist;
    let url = app.globalData.apiUrl.getReceptionist1;
    app.func.getRequest_data(
      url, {
        empName: this.data.searchWord,
      },
      (res) => {
        console.log(res)
        if (res.data.receptionists.length !== 0) {
          let receptionistList = [];
          let receptionistListAll = [];
          res.data.receptionists.forEach((item) => {
            receptionistList.push(`${item.userName}-${item.department}`);
          });
          res.data.receptionists.forEach((item) => {
            receptionistListAll.push({
              receptionist: item.operatorId,
              receptionistName: item.userName,
              // receptionistTelephone: item.telephone,
              receptionistDept: item.department,
            });
          });
          this.setData({
            receptionistList,
            receptionistListAll,
          });
        }
      }
    );
  },
  showForeignerPopup() {
    this.setData({
      foreigneShow: true
    });
  },
  onForeignerClose() {
    this.setData({
      foreigneShow: false
    });
  },
  onForeignerConfirm(event) {
    this.setData({
      isForeigner: event.detail.value,
      foreigneShow: false
    });
  },
  onShowVisitReason() {
    this.setData({
      showVisitReason: true
    });
  },

  onCloseVisitReason() {
    this.setData({
      showVisitReason: false
    });
  },
  onConfirmVisitReason(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    this.setData({
      ["VisitReason.reason"]: value,
      ["VisitReason.index"]: index + 1,
      showVisitReason: false,
    });
  },
  onShowDate() {
    this.setData({
      showDate: true
    });
  },
  onCloseShowDate() {
    this.setData({
      showDate: false
    });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  formatDate2(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  onConfirmShowDate(event) {
    const [start, end] = event.detail;
    this.setData({
      showDate: false,
      date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
      visitBeginDate: `${this.formatDate2(start)}`,
      visitEndDate: `${this.formatDate2(end)}`,
    });
  },
  onAddPerson() {
    this.setData({
      showAddPerson: true,
    });
  },
  onCloseAddPerson() {
    this.setData({
      showAddPerson: false,
    });
  },
  goAddPerson() {
    wx.navigateTo({
      url: "../addPerson/addPerson",
    });
  },
  confirmChoose() {
    let finaRes = this.data.wPersonsList.filter((item) => {
      return this.data.result.includes(item.id.toString());
    });
    let lmappVisitExternalPersons = [];
    finaRes.forEach((item) => {
      lmappVisitExternalPersons.push({
        externalPersonId: item.id
      });
    });
    this.setData({
      chooseWPersonsList: finaRes,
      lmappVisitExternalPersons,
      showAddPerson: false,
    });
  },
  deleteChoose(e) {
    let result = this.data.result.filter((item) => {
      return item !== e.currentTarget.dataset.id.toString();
    });
    let chooseWPersonsList = this.data.chooseWPersonsList.filter((item) => {
      return item.id !== e.currentTarget.dataset.id;
    });
    let lmappVisitExternalPersons = this.data.lmappVisitExternalPersons.filter(
      (item) => {
        return item.externalPersonId !== e.currentTarget.dataset.id;
      }
    );
    this.setData({
      result,
      chooseWPersonsList,
      lmappVisitExternalPersons,
    });
  },
  onChange(event) {
    this.setData({
      result: event.detail,
    });
  },
  toggle(event) {
    const {
      index
    } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
  onPlaceChoose(event) {
    // console.log(event.detail)
    this.setData({
      placeChoose: event.detail
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
      that.data.receptionistInfo.receptionistName == "" ||
      that.data.visitorCompany == "" ||
      that.data.isForeigner == "" ||
      that.data.VisitReason.reason == "" ||
      that.data.date == "" ||
      that.data.placeChoose == ""||
      that.data.activityPath ==""
    ) {
      wx.showToast({
        title: '星号栏不能为空',
        icon: 'error'
      })
    } else if (that.data.lmappVisitExternalPersons.length == 0) {
      wx.showToast({
        title: '需添加外来人员',
        icon: 'error'
      })
    } else {
      wx.showModal({
        title: "确认无误?",
        content: "表单无法修改",
        success(res) {
          if (res.confirm) {
            let url = app.globalData.apiUrl.addLmappVisit;
            app.func.postRequest_Data_session(
              url, {
                lmappvisit: {
                  title: `${that.data.visitorCompany}入厂申请`,
                  receptionist: that.data.receptionistInfo.receptionist,
                  receptionistName: that.data.receptionistInfo.receptionistName,
                  createByDept: that.data.createByDept,
                  // receptionistTelephone: that.data.receptionistInfo.receptionistTelephone,
                  visitReason: that.data.VisitReason.index,
                  receptionistDept: that.data.receptionistInfo.receptionistDept,
                  visitorCompany: that.data.visitorCompany,
                  activityPath: that.data.activityPath,
                  visitBeginDate: that.data.visitBeginDate,
                  visitEndDate: that.data.visitEndDate,
                  carryObject: that.data.carryObject,
                  isForeigner: that.data.isForeigner == "否" ? 0 : 1,
                  place: that.data.placeChoose == 1 ? "大东厂区" : "苏家屯厂区",
                },
                lmappVisitExternalPersons: that.data.lmappVisitExternalPersons,
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
                  // console.log(res.data);
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