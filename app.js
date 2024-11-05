// app.js
var util = require("./utils/globalFunctions.js");
App({
  onLaunch() {
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    that.globalData.navBarHeight = systemInfo.statusBarHeight + 44;
    that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    that.globalData.menuTop = menuButtonInfo.top;
    that.globalData.menuHeight = menuButtonInfo.height + 5;
    that.globalData.height_tab =
      systemInfo.screenHeight - that.globalData.navBarHeight - 120;
    that.globalData.height =
      systemInfo.screenHeight - that.globalData.navBarHeight - 64;
  },
  globalData: {
    inter: "",
    accountInfo: "",
    openid: "",
    userId: "",
    userInfo: null,
    active: 0,
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuTop: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    height_tab: 0, //滑动窗口高度(带导航条)
    usuallyContent: [
      "审批通过",
      "不同意",
      "主接人全程陪同。",
      "审批通过，请做好接待工作。",
      "退回修改",
    ],
    apiUrl: {
      getUserInfo: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.emp.getUserInfo.biz.ext",
      lmappLogin: "https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.lmappLogin.biz.ext",
      queryLmappToDo: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitbiz.queryLmappToDo.biz.ext",
      queryLmappHaveDone: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitbiz.queryLmappHaveDone.biz.ext",
      lmappQueryOrg: "https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.lmappQueryOrg.biz.ext",
      lmappRegister: "https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.lmappRegister.biz.ext",
      lmappRegisterExternal: "https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.lmappRegisterExternal.biz.ext",
      lmapplogout: "https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.lmapplogout.biz.ext",
      addLmappExternalPerson: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappexternalpersonbiz.addLmappExternalPerson.biz.ext",
      queryLmappExternalPersonsWithoutPage: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappexternalpersonbiz.queryLmappExternalPersonsWithoutPage.biz.ext",
      getReceptionist: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitbiz.getReceptionist.biz.ext",
      getReceptionist1: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitbiz.getReceptionist1.biz.ext",
      getReceptionistLeader: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitbiz.getReceptionistLeader.biz.ext",
      addLmappVisit: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitbiz.addLmappVisit.biz.ext",
      lmappUpdatePassword: "https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.lmappUpdatePassword.biz.ext",
      queryLmappVisitEnds: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitdelaybiz.queryLmappVisitEnds.biz.ext",
      addLmappVisitDelay: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitdelaybiz.addLmappVisitDelay.biz.ext",
      queryLmappExternalPersonsWithPage: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappexternalpersonbiz.queryLmappExternalPersonsWithPage.biz.ext",
      deleteLmappExternalPersons: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappexternalpersonbiz.deleteLmappExternalPersons.biz.ext",
      queryLmappVisitsWithPage: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitbiz.queryLmappVisitsWithPage.biz.ext",
      queryLmappVisitDelaysWithPage: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitdelaybiz.queryLmappVisitDelaysWithPage.biz.ext",
      getLmappVisitDetail: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitbiz.getLmappVisitDetail.biz.ext",
      getLmappVisitDelayDetail: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitdelaybiz.getLmappVisitDelayDetail.biz.ext",
      wfLmappVisitAuditChooseLeader: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitbiz.wfLmappVisitAuditChooseLeader.biz.ext",
      wfLmappVisitAudit: "https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.lmappvisitbiz.wfLmappVisitAudit.biz.ext",
      lmappGetAppId: "https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.lmappGetAppId.biz.ext",
      getAesCode: "https://slae.aecc.cn:8033/default/com.primeton.weixin.lmappvisitbiz.getAesCode.biz.ext",
      lmappQuerySessionStatus: "https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.lmappQuerySessionStatus.biz.ext",
      getRandomID: "https://slae.aecc.cn:8033/default/com.primeton.weixin.emp.getRandomID.biz.ext",
    },
  },
  func: {
    loginFunc: util.loginFunc,
    getRequest: util.getRequest,
    postRequest_Data: util.postRequest_Data,
    deletePersonInfo: util.deletePersonInfo,
    getRequest_session: util.getRequest_session,
    getRequest_data_session: util.getRequest_data_session,
    getRequest_data: util.getRequest_data,
    getUserInfo: util.getUserInfo,
    postRequest_Data_session: util.postRequest_Data_session,
    isPhone: util.isPhone,
    isCard: util.isCard,
    isCarNum: util.isCarNum,
  },
});