const {
  getCurrentPage,
} = require("../../../miniprogram_npm/@vant/weapp/common/utils");
import drawQrcode from '../../../utils/weapp.qrcode.min.js'
var app = getApp();
Page({
  data: {
    defaultData: {
      text: "申请单",
      ifShow: false,
    },
    showAgree: false,
    showChoose: false,
    receptionist: "",
    showReceptionist: false,
    searchWord: "",
    receptionistList: [],
    active: 0,
    activeIcon: '',
    height: app.globalData.height,
    steps: [],
    extend: {},
    visitReason: ["技术交流", "施工", "提送货", "排残", "安装调试", "业务洽谈"],
    content: "",
    usuallyContent: app.globalData.usuallyContent,
    todoMessage: [],
    opinion: "",
    showAddPerson: false,
    personInfo: {},
    showCode: false,
    inTime: false,
    userId: "",
    code: "",
    codeText: {},
    type: '',
    jobNo: '',
    UUID: '',
  },
  onShow() {
    // console.log(wx.getStorageSync("mesInfo"))
    wx.removeStorageSync("jobNo");
    wx.removeStorageSync("UUID");
    let id = "";
    // let currentstate = wx.getStorageSync('currentstate') == 7 ? '已完成' : '审批中'
    // this.setData({
    //   currentstate
    // })
    // console.log(typeof wx.getStorageSync("delayId"))
    if (typeof wx.getStorageSync("delayId") !== "number") {
      id = wx.getStorageSync("visitId");
    } else {
      id = wx.getStorageSync("delayId");
    }
    // console.log(id);
    let info = wx.getStorageSync("mesInfo");
    if (!info.endtime) {
      this.setData({
        showAgree: true,
      });
    }
    // console.log(info.processinstname);
    // console.log(id);
    let url = "";
    if (info.processinstname == "外来人员入厂审批流程") {
      url = app.globalData.apiUrl.getLmappVisitDetail;
    } else {
      url = app.globalData.apiUrl.getLmappVisitDelayDetail;
      this.setData({
        type: 'yanshi'
      })
    }
    app.func.getRequest_data(
      url, {
        id: id,
      },
      (res) => {
        //console.log(inTime)
        let todoMessage = res.data;
        // console.log(todoMessage)
        let step = todoMessage.workitemVs;
        if (step[0].workitemname == '安全保卫部审批') {
          this.setData({
            content: '请履行接入送出，全程陪同，遵守公司一切安全相关要求。'
          })
        }
        if (step[0].workitemname == '安全保卫部审批' && step[0].endtime !== null) {
          this.setData({
            currentstate: '已完成'
          })
        } else {
          this.setData({
            currentstate: '审批中'
          })
        }
        let inTime = (this.data.currentstate == '已完成' && res.data.lmappvisit.visitEndDate >= new Date().toJSON().substring(0, 10) && wx.getStorageSync("yiban"))
        // console.log(todoMessage.workitemVs);
        let steps = step.map((item) => {
          return {
            text: item.workitemname,
            desc: item.extend1 == null ? (item.extend2 == 'Y' ? '同意' : '不同意') : (item.extend2 == 'Y' ? '同意' : '不同意') + '，' + item.extend1,
            person: item.partiname,
            time: item.endtime == null ? '' : item.endtime,
          };
        });
        steps[steps.length - 1].desc = '';
        steps.reverse();
        // let steps = [
        //   {text:'拟搞人申请',desc:'领导你好，需要审批某某合同', person:'李某某', time:'2024-02-20 13:23:21.0'},
        //   {text:'主接人审批',desc:'合同没问题，走流程即可，我这边没问题合同没问题，走流程即可，我这边没问题合同没问题走流程即可，我这边没问题合同没问题，走流程即可，我这边没问题', person:'刘亮', time:'2024-02-20 14:45:11.0'},
        //   {text:'主接人所在部门领导审批',desc:'', person:'王晓丽', time:''},
        // ]
        if (this.data.currentstate == '已完成') {
          steps[steps.length] = {
            text: '结束',
            desc: '',
            person: '',
            time: '',
          }
        } else {
          steps[steps.length - 1].desc = '';
        }
        let active = steps.length - 1;
        if (steps[steps.length - 1].time == '' && steps[steps.length - 1].text !== '结束') {
          this.setData({
            activeIcon: 'weapp-nav'
          })
        } else {
          this.setData({
            activeIcon: 'success'
          })
        }
        let extend = todoMessage.workitemVs.find((item) => {
          return item.extend2 !== null;
        });
        if (steps[steps.length - 1].text == "主接人审批" && this.data.type !== 'yanshi') {
          let showChoose = true;
          this.setData({
            todoMessage,
            steps,
            active,
            showChoose,
            extend,
            inTime
          });
        } else {
          this.setData({
            todoMessage,
            steps,
            active,
            extend,
            inTime
          });
        }
        // console.log(this.data.steps);
        // console.log(this.data.extend != undefined);
      }
    );

    // console.log(this.data.todoMessage);
  },
  onClickReceptionist() {
    this.setData({
      showReceptionist: true,
      receptionist: "",
      cascaderValue: "",
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
      receptionistInfo: receptionistInfo,
      showReceptionist: false,
    });
    // console.log(this.data.receptionistInfo);
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
    let url = app.globalData.apiUrl.getReceptionistLeader;
    app.func.getRequest_data(
      url, {
        empName: this.data.searchWord,
      },
      (res) => {
        // console.log(res.data)
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
              receptionistTelephone: item.telephone,
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
  // deleteChoose(e) {
  //   // console.log(e.currentTarget.dataset.item);
  //   app.globalData.usuallyContent = app.globalData.usuallyContent.filter(
  //     (item) => {
  //       return item !== e.currentTarget.dataset.item;
  //     }
  //   );
  //   this.setData({
  //     usuallyContent: app.globalData.usuallyContent,
  //   });
  // },
  onCancel(e) {
    let that = this;
    let choose = e.currentTarget.dataset.index;
    wx.showModal({
      title: "确认退回？",
      content: "操作无法修改",
      success(res) {
        if (res.confirm) {
          that.submit(choose);
        }
      },
    });
  },
  onSubmit(e) {
    let that = this;
    let choose = e.currentTarget.dataset.index;
    if (this.data.showChoose == true && this.data.receptionist == "") {
      wx.showToast({
        title: '请选择部门领导',
        icon: "error"
      })
    } else {
      wx.showModal({
        title: "确认同意?",
        content: "表单无法修改",
        success(res) {
          if (res.confirm) {
            that.submit(choose);
          }
        },
      });
    }

  },
  submit(choose) {
    if (this.data.showChoose && this.data.type !== 'yanshi') {
      let url = app.globalData.apiUrl.wfLmappVisitAuditChooseLeader;
      app.func.postRequest_Data_session(
        url, {
          processinstid: wx.getStorageSync("mesInfo").processinstid,
          workitemid: wx.getStorageSync("mesInfo").workitemid,
          opinion: choose == 0 ? "N" : "Y",
          content: this.data.content,
          leader: this.data.receptionistInfo.receptionist ?
            this.data.receptionistInfo.receptionist : "",
          leaderName: this.data.receptionistInfo.receptionistName ?
            this.data.receptionistInfo.receptionistName : "",
        },
        (res) => {
          if (Object.keys(res.data).length == 0) {
            wx.showToast({
              title: "提交成功",
              icon: "success",
              duration: 1000,
              success() {
                let pages = getCurrentPages();
                let prePage = pages[pages.length - 2];
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                    success() {
                      prePage.refresh1();
                      prePage.refresh2();
                    },
                  });
                }, 1000);
              },
            });
          } else {
            // console.log(res.data)
            wx.showToast({
              title: "出错了",
              icon: "error",
            });
          }
        }
      );
    } else {
      // console.log('111')
      let url = app.globalData.apiUrl.wfLmappVisitAudit;
      app.func.postRequest_Data_session(
        url, {
          processinstid: wx.getStorageSync("mesInfo").processinstid,
          workitemid: wx.getStorageSync("mesInfo").workitemid,
          opinion: choose == 0 ? "N" : "Y",
          content: this.data.content,
        },
        (res) => {
          if (Object.keys(res.data).length == 0) {
            wx.showToast({
              title: "提交成功",
              icon: "success",
              duration: 1000,
              success() {
                let pages = getCurrentPages();
                let prePage = pages[pages.length - 2];
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                    success() {
                      prePage.refresh1();
                      prePage.refresh2();
                    },
                  });
                }, 1000);
              },
            });
          } else {
            // console.log(res.data)
            wx.showToast({
              title: "出错了",
              icon: "error",
            });
          }
        }
      );
    }
  },
  showPerson(e) {
    // console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let personInfo =
      this.data.todoMessage.lmappvisit.lmappVisitExternalPersons.find(
        (item) => {
          return item.externalPersonId == id;
        }
      );
    this.setData({
      personInfo,
      showAddPerson: true,
    });
    // console.log(this.data.personInfo);
  },
  onCloseAddPerson() {
    this.setData({
      showAddPerson: false,
    });
  },
  getJobNo(e) {
    let url = app.globalData.apiUrl.getReceptionist;
    app.func.getRequest_data(
      url, {
        empName: e,
      },
      (res) => {
        wx.removeStorageSync("jobNo");
        wx.setStorageSync("jobNo", res.data.receptionists[0].jobNo);
      }
    );
  },
  getUUid() {
    let url = app.globalData.apiUrl.getRandomID;
    app.func.getRequest(
      url,
      (res) => {
        wx.removeStorageSync("UUID");
        wx.setStorageSync("UUID", res.data.UUID);
      }
    );
  },
  async creatList() {
    wx.removeStorageSync("jobNo");
    wx.removeStorageSync("UUID");
    let that = this
    // console.log(this.data.todoMessage.lmappvisit)
    await this.getJobNo(this.data.todoMessage.lmappvisit.receptionistName)
    await this.getUUid()
    let personInfo = this.data.personInfo
    let lmappvisit = this.data.todoMessage.lmappvisit
    let time = new Date().toJSON().substring(0, 10).split("-")
    let time4 = new Date().toTimeString().substring(0, 8).split(":")
    let timesmall = new Date().getMilliseconds()
    let time1 = `${time[0]}${time[1]}${time[2]}010010`
    let time2 = `${time[0]}${time[1]}${time[2]}235900`
    let time3 = `${time[0]}${time[1]}${time[2]}${time4[0]}${time4[1]}${time4[2]}.${timesmall}`.slice(2)
    // console.log(time1)
    // console.log(time2)
    // console.log(time3)
    var i = setInterval(function () {
      // console.log(wx.getStorageSync('jobNo'))
      if (wx.getStorageSync('jobNo') !== '' && wx.getStorageSync('UUID') !== '') {
        let codeText = {
          visitorName: personInfo.name,
          visitorIdCard: personInfo.identityCardNum,
          visitorIdCardType: "111",
          visitorPhone: personInfo.telephone,
          workUnit: lmappvisit.visitorCompany,
          carNumber: personInfo.carLicenseNum,
          visitPurpose: that.data.visitReason[lmappvisit.visitReason - 1],
          jobNo: wx.getStorageSync('jobNo'),
          startTime: time1,
          endTime: time2,
          areas: "门禁分组",
          date: time3,
          validTime: "m5",
          codeId: wx.getStorageSync('UUID'),
          customa: lmappvisit.carryObject,
          customb: lmappvisit.activityPath,
        }
        let str = JSON.stringify(codeText);
        // console.log(str)
        app.func.getRequest_data(
          app.globalData.apiUrl.getAesCode, {
            input: str,
          },
          (res) => {
            let code = res.data.out;
            let code1 = 'begin' + code + 'end'
            // console.log(code)
            // console.log(code1)
            const query = wx.createSelectorQuery()
            query.select('#myQrcode')
              .fields({
                node: true,
                size: true
              })
              .exec((res) => {
                var canvas = res[0].node
                // 调用方法drawQrcode生成二维码
                drawQrcode({
                  canvas: canvas,
                  canvasId: 'myQrcode',
                  width: 260,
                  padding: 30,
                  background: '#ffffff',
                  foreground: '#000000',
                  text: code1,
                  correctLevel: 1
                })
                that.setData({
                  showCode: true,
                })
                // 获取临时路径（得到之后，想干嘛就干嘛了）
                wx.canvasToTempFilePath({
                  canvasId: 'myQrcode',
                  canvas: canvas,
                  x: 0,
                  y: 0,
                  width: 260,
                  height: 260,
                  destWidth: 260,
                  destHeight: 260,
                  success(res) {
                    // console.log('二维码临时路径：', res.tempFilePath)
                  },
                  fail(res) {
                    // console.error(res)
                  }
                })
              })
          })
        clearInterval(i)
      }
    }, 100)

  },
  onCode() {
    let personInfo = this.data.personInfo
    this.setData({
      showAddPerson: false,
      name: personInfo.name
    })
    this.creatList()
  },
  onCloseCode() {
    this.setData({
      showCode: false
    })
  }
});