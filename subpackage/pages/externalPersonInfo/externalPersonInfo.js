var app = getApp();
Page({
  data: {
    defaultData: {
      text: "外来人员信息",
      ifShow: false,
    },
    personInfo: [],
    pageIndex: 0,
    flag: true,
    isLast: false,
  },
  onLoad() {
    this.setData({
      personInfo: [],
      pageIndex: 0,
      flag: true,
      isLast: false,
    });
    this.getInfo();
  },
  getInfo() {
    if (this.data.isLast) {
      wx.showToast({
        title: "已到底",
        icon: "error",
      });
    } else {
      this.setData({
        flag: false,
      });
      let url = app.globalData.apiUrl.queryLmappExternalPersonsWithPage;
      app.func.getRequest_data_session(
        url, {
          pageSize: 5,
          pageIndex: this.data.pageIndex
        },
        (res) => {
          this.setData({
            personInfo: this.data.personInfo.concat(
              res.data.lmappExternalPersons
            ),
            isLast: res.data.page.isLast,
            flag: true,
          });
        }
      );
    }
    console.log(this.data.personInfo)
  },
  getMore() {
    if (this.data.flag) {
      this.setData({
        flag: false,
        pageIndex: ++this.data.pageIndex,
      });
      this.getInfo();
    }
  },
  ondelete(e) {
    this.deleteInfo(e);
  },
  deleteInfo(e) {
    var that = this;
    wx.showModal({
      title: "提示",
      content: "是否删除(无法恢复)",
      success(res) {
        if (res.confirm) {
          let url = app.globalData.apiUrl.deleteLmappExternalPersons;
          app.func.deletePersonInfo(
            url, {
              lmappexternalpersons: [{
                id: e.target.id,
              }, ],
            },
            (res) => {
              if (Object.keys(res.data).length == 0) {
                wx.showToast({
                  title: "删除成功",
                  icon: "success",
                  mask: true,
                });
              }
            }
          );
          that.onLoad();
        }
      },
    });
  },
  addPerson() {
    wx.navigateTo({
      url: "../addPerson/addPerson",
    });
  },
});