const CryptoJS = require("crypto-js");

//加密数据
function encryptData(data) {
  let key = "liming";
  const encryptedData = CryptoJS.DES.encrypt(
    JSON.stringify(data),
    key
  ).toString();
  return encryptedData;
}

//解密数据
function decryptData(encryptedData) {
  let key = "liming";
  const bytes = CryptoJS.DES.decrypt(encryptedData, key);
  const originalData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return originalData;
}

var myFunction = {
  getPageChange() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        active: tabNum,
      });
    }
  },
};
// 登录
function loginFunc(url, data, cb) {
  wx.showLoading({});
  wx.request({
    url: url,
    // data: data,
    data: encryptData(data),
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
    },
    method: "GET",
    responseType: "text",
    success: function (res) {
      wx.clearStorage();
      wx.setStorageSync(
        "sessionid",
        res.header["Set-Cookie"].replaceAll("path=/,", "")
      );
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}
// 获取当前SESSION状态
// function SessionStatus() {
//   wx.showLoading({});
//   wx.request({
//     url: 'https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.lmappQuerySessionStatus.biz.ext',
//     header: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       "cache-control": "no-cache",
//     },
//     method: "GET",
//     responseType: "text",
//     success: function (res) {
//       wx.hideLoading();
//       if (!res.data.status) {
//         wx.navigateTo({
//           url: '/pages/login/login',
//           success() {
//             wx.showModal({
//               title: '登录过期，请重新登录',
//               confirmText: "确认",
//               showCancel: false,
//             })
//           }
//         })
//       }
//     },
//     fail: function (res) {
//       wx.hideLoading();
//       wx.showModal({
//         title: '过期检查异常',
//         confirmText: "确认",
//         showCancel: false,
//       })
//     },
//   });
// }
// 1获取一级部门名称 2获取微信app 3获取一个随机UUID
function getRequest(url, cb) {
  wx.showLoading({});
  wx.request({
    url: url,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
    },
    method: "GET",
    responseType: "text",
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}
// 注册
function postRequest_Data(url, data, cb) {
  wx.showLoading({});
  wx.request({
    url: url,
    data: data,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "cache-control": "no-cache",
    },
    method: "POST",
    dataType: "json",
    responseType: "text",
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}
// 删除外来人员信息
function deletePersonInfo(url, data, cb) {
  wx.showLoading({});
  wx.request({
    url: url,
    data: data,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "cache-control": "no-cache",
    },
    method: "POST",
    dataType: "其他",
    responseType: "text",
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}
// 1登出 2获取个人信息 3查询外来人员信息-不带分页
async function getRequest_session(url, cb) {
  wx.showLoading({});
  // await SessionStatus()
  wx.request({
    url: url,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
      cookie: wx.getStorageSync("sessionid"),
    },
    method: "GET",
    responseType: "text",
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}
// 1查询外来人员信息-带分页 2获取用户发起的入厂审批流程 3获取用户的待办信息 4获取用户的已办信息 5选择已经审批结束的入厂流程信息 6获取用户发起的延时出厂流程
async function getRequest_data_session(url, data, cb) {
  wx.showLoading({});
  // await SessionStatus()
  wx.request({
    url: url,
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
      cookie: wx.getStorageSync("sessionid"),
    },
    method: "GET",
    responseType: "text",
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}
// 1改密码 2选择主接责任人 3获取入厂流程表单和审批详情 4获取延时流程表单和页面详情 5获取AES转码
function getRequest_data(url, data, cb) {
  wx.showLoading({});
  wx.request({
    url: url,
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
    },
    method: "GET",
    responseType: "text",
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}
// 1新增外来人员信息 2发起外来人员入厂审批流程
async function postRequest_Data_session(url, data, cb) {
  wx.showLoading({});
  // await SessionStatus()
  wx.request({
    url: url,
    data: data,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "cache-control": "no-cache",
      cookie: wx.getStorageSync("sessionid"),
    },
    method: "POST",
    dataType: "json",
    responseType: "text",
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}

//手机号不严格校验
function isPhone(value) {
  if (!/^1[3456789]\d{9}$/.test(value)) {
    return false;
  } else {
    return true;
  }
}

//身份证号不严格校验
function isCard(value) {
  if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
    return false;
  } else {
    return true;
  }
}
//车牌号校验
function isCarNum(value) {
  let reg =
    /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
  const careg = reg.test(value);
  return careg;
}
module.exports = {
  myFunction,
  loginFunc,
  getRequest,
  postRequest_Data,
  deletePersonInfo,
  getRequest_session,
  getRequest_data_session,
  getRequest_data,
  postRequest_Data_session,
  isPhone,
  isCard,
  isCarNum,
};