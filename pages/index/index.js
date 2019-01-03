// pages/indexe/index.js
var page;
var util = require('../../util/util.js');
import { AUTH_LOGIN } from "../../lib/api.js";
import {
  WISH_CREATE
} from "../../lib/api.js";
let app = getApp();
let goodsList = [
  { actEndTime: '2019-01-05 19:00:00' },
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSuccess: false,
    music: true,
    dataList: [],
    doommData: [],
    showWaiter: false,
    timeOut: [],
    //请求数据当前页码
    currentPageIndex: 1,
    totalNum: 0,
    countDownList: [],
    actEndTimeList: [],
    showPublish: false,
    timmer: 0
  },
  getWish() {
    if (this.data.getWish == 1) {
      return false;
    }
    this.setData({
      getWish: 1
    })

    let that = this;
    /**分页参数构建 */
    var options = {};
    options.page = that.data.currentPageIndex;
    options.currentStartIndex = that.data.currentPageIndex * 10;
    options.currentPageIndex = that.data.currentPageIndex;
    options.perPageNum = 5;
    util.request(WISH_CREATE, options, 'GET').then(res => {

      if (res.code == 200) {
        if (res.body.wishList.length < options.perPageNum) {
          that.setData({
            totalNum: res.body.totalNum,
            currentPageIndex: 1
          })
        } else {

          var dataList = this.data.dataList;
          for (let i = 0; i < res.body.wishList.length; i++) {
            if (res.body.wishList[i]) {
              dataList.push(new Doomm(res.body.wishList[i].avatar, res.body.wishList[i].text, i, Math.floor(Math.random() * 10, 3), getRandomColor()));
            }
          }
          that.setData({
            totalNum: res.body.totalNum,
            currentPageIndex: that.data.currentPageIndex + 1,
            dataList: dataList
          })
        }
      } else {
      }
      that.setData({
        getWish: 0
      })
    });
  }
  ,
  getStart() {
    if (this.data.lock) {
      return false;
    }
    this.setData(
      { lock: 1 }
    )
    let that = this;
    /**分页参数构建 */
    var options = {};
    options.page = 2;
    options.currentStartIndex = 20;
    options.currentPageIndex = 2;
    options.perPageNum = 5;
    util.request(WISH_CREATE, options, 'GET').then(res => {
      if (res.code == 200) {
        var dataList = this.data.dataList;
        for (let i = 0; i < res.body.wishList.length; i++) {
          if (res.body.wishList[i]) {
            dataList.push(new Doomm(res.body.wishList[i].avatar, res.body.wishList[i].text, i, Math.floor(Math.random() * 10, 3), getRandomColor()));
          }
        }
        that.setData({
          totalNum: res.body.totalNum,
          currentPageIndex: that.data.currentPageIndex + 1,
          dataList: dataList
        })
      } else {
      }
    });
  },
  showWaiter() {
    var showWaiter = this.data.showWaiter;

    if (showWaiter) {
      this.setData({
        currentPage: 0
      })
    } else {
      this.setData({
        currentPage: 1
      })
    }
    this.setData({
      showWaiter: !this.data.showWaiter
    })
  },
  go() {
  },
  onLoad: function () {

    let that = this;
    let endTimeList = [];
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    goodsList.forEach(o => { endTimeList.push(o.actEndTime) })
    this.setData({ actEndTimeList: endTimeList });
    // 执行倒计时函数
    this.countDown()

    this.setData({
      music: app.globalData.musicStatus == 1 ? false : true,
      height: app.globalData.height,
    })
    page = this;
    that.bindbt();
  },
  bindbt: function () {
    let that = this;
    that.getStart()
    //每隔5秒获取一次数据
    var setInter = setInterval(
      function () {
        that.getWish()
      }, 6000);
    //每隔2秒发射一个数据
    var timeOutdata = setInterval(function () {
      if (page.data.push == 1) {
        return false;
      }
      page.setData({
        push: 1
      })
      var dataList = page.data.dataList;
      var doommData = page.data.doommData;
      if (doommData.length > 8) {
        doommData.splice(0, 2);
        var data = dataList.splice(0, 1);
        if (data[0]) {
          doommData.push(data[0])
          page.setData({
            doommData: doommData,
            dataList: dataList
          })
        }
        page.setData({
          push: 0
        })
      } else {
        var data = dataList.splice(0, 1);
        if (data[0]) {
          doommData.push(data[0])
          page.setData({
            doommData: doommData,
            dataList: dataList
          })
        }
        page.setData({
          push: 0
        })
      }

    }, 3000)
    //记下定时器
    app.globalData.inter = setInter;
    app.globalData.timeOutdata = timeOutdata
  },
  goPublish() {
    this.onHide()
    wx.navigateTo({
      url: '/pages/publish/index?music=' + (this.data.music ? 0 : 1) + "",
      success: function () {
      }
    })
  },
  music(status) {
    let that = this;
    if (status == 1) {
      app.AppMusic.pause();
      app.AppMusic.onPause(() => {
        console.log('暂停播放');
        that.setData({
          status: false
        })
      })
      app.globalData.musicStatus = 1
    } else {
      app.AppMusic.play();
      app.AppMusic.onPlay(() => {
        console.log('开始播放');
        that.setData({
          status: true
        })
      })
      app.globalData.musicStatus = 0;
    }
    console.log(status)
  },

  actionMusic() {

    if (this.data.music) {
      //暂停 
      this.music(1)
    } else {
      //播放
      this.music(0)
    }
    this.setData({
      music: !this.data.music
    })
  },

  onHide() {
    i = 0;
    clearInterval(app.globalData.inter);
    clearInterval(app.globalData.timeOutdata);
    clearInterval(this.data.timeInter)
    doommList = [];
    this.setData({
      doommData: [],
      dataList: []
    })
  },
  bindGetUserInfo(event) {
    let that = this;
    wx.login({
      success(loginRes) {
        if (loginRes.code) {
          wx.getUserInfo({
            success(res) {

              var postData = {
                encryptedData: res.encryptedData,
                iv: res.iv,
                signature: res.signature,
                nickName: res.userInfo.nickName,
                "avatarUrl": res.userInfo.avatarUrl
              }
              postData.code = loginRes.code
              that.login(postData);
            }
          })
        } else {
          wx.showToast({
            title: '获取微信信息失败',
          })
        }
      }
    })
    // if (event.detail.errMsg == "getUserInfo:ok") {
    //   wx.setStorageSync("userInfo", event.detail.rawData)
    //  var postData={
    //    encryptedData: event.detail.encryptedData,
    //    iv: event.detail.iv,
    //    signature: event.detail.signature,
    //    nickName: event.detail.userInfo.nickName,
    //    "avatarUrl": event.detail.userInfo.avatarUrl
    //  }
    //   this.initImParams(postData)

    // } else {
    //   wx.showLoading({
    //     title: '您取消了授权',
    //     duration: 1500
    //   })
    // }

  },
  initImParams: function (postData) {
    var that = this
    wx.login({
      success: res => {
        postData.code = res.code
        that.login(postData);
      }
    })
  },
  onShow() {
    let that = this;
    this.music(app.globalData.musicStatus);
    let endTimeList = [];
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    goodsList.forEach(o => { endTimeList.push(o.actEndTime) })
    this.setData({ actEndTimeList: endTimeList });
    // 执行倒计时函数
    this.countDown()
    i = 0;
    doommList = [];
    this.setData({
      doommData: [],
      dataList: [],
      getWish: 0,
      push: 0
    })
    if (wx.getStorageSync("token")) {
      this.setData({
        login: true,
      })
    }
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    goodsList.forEach(o => { endTimeList.push(o.actEndTime) })
    this.setData({ actEndTimeList: endTimeList });
    // 执行倒计时函数
    this.countDown()

    this.setData({
      music: app.globalData.musicStatus == 1 ? false : true,
      height: app.globalData.height,
    })
    page = this;
    that.bindbt();
  }
  ,
  login(data) {
    var that = this
    wx.showLoading({
      title: '正在登录',
    })

    util.request(AUTH_LOGIN, data, 'POST').then(res => {
      if (res.code == 200) {
        wx.setStorageSync("user", res.body.user);
        wx.setStorageSync("token", res.body.token);
        that.goPublish();
        wx.hideLoading()
      } else {
        wx.hideLoading()
        wx.showLoading({
          title: '登录失败',
          duration: 1500
        })
      }

    });

  },
  /**倒计时相关 */


  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    let that = this;
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      let endTime = new Date("2019-01-05 19:00:00".replace(/-/g, "/")).getTime();

      let obj = null;

      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else {//活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
        that.setData({
          end: true
        })
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDownList: countDownArr })
    var timeInter = setTimeout(this.countDown, 1000);

    this.setData({
      timeInter: timeInter
    })
  },
  result() {
    if (this.data.end) {
      console.log(3333333)
    }


    wx.showModal({
      title: '等待开奖',
      content: "开奖倒计时：" + this.data.countDownList[0].day + "天" + this.data.countDownList[0].hou + "时" + this.data.countDownList[0].min + "分" + this.data.countDownList[0].sec + "秒",
      showCancel: true, //是否显示取消按钮
      cancelText: "关闭", //默认是“取消”
      confirmText: "确定", //默认是“确定”
      success: function (res) {
        if (res.cancel) { }
      },
      fail: function (res) { }, //接口调用失败的回调函数
      complete: function (res) {

      }, //接口调用结束的回调函数（调用成功、失败都会执行）
    })

  },
  showCredit() {
    let that = this;
    // wx.showLoading({
    //   title: '研发中',
    //   duration: 1500,
    // })
    that.setData({
      showSuccess: true
    })










  },

  close() {
    this.setData({
      showSuccess: false
    })
  }


})

var doommList = [];
var timeArray = [];
var topArray = [4, 2, 5, 2, 3]
var flag = false;
var i = 0;
class Doomm {
  constructor(avatar, text, top, time, color) {
    if (topArray.length < 2) {
      topArray = [5, 2, 3, 4, 3]
      flag = !flag;
    }
    if (flag) {
      flag = !flag;

      top = 3;

    } else {
      top = topArray.shift();

      topArray.splice(topArray.indexOf(top), 1);
      topArray.push(top)

    }

    top = top * 6 - 5;
    if (topArray.length < 1) {
      topArray.unshift(3)
    }

    this.avatar = avatar;
    this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    let that = this;
    this.id = i++;


  }
}

function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

