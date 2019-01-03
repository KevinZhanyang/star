// pages/publish/index.js
let app = getApp();
var util = require('../../util/util.js');
import {
  WISH_CREATE
} from "../../lib/api.js";
var pages;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSuccess: false,
    dataList: [],
    timeInter: 0,
    doommData: [],
    timeOut: [],
    timmer: 0,
    currentPageIndex: 1,
    totalNum: 0,
    datalock: 0,
    music: true,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '许下心愿', //导航栏 中间的标题
      type: 1,
    },
    lastX: 0,          //滑动开始x轴位置
    lastY: 0,          //滑动开始y轴位置
    text: "没有滑动",
    currentGesture: 0, //标识手势
  },
  hideFilter() {
    this.onHide()
    wx.navigateBack({
    })
  },
  _backhome() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.downloadFile({
      url: wx.getStorageSync("user").avatar, //注意公众平台是否配置相应的域名
      success: function (res) {
        that.setData({
          acvtarUrl: res.tempFilePath
        })
        app.globalData.acvtarUrl = res.tempFilePath
      }
    })
    let that = this;
    pages = this;

    this.setData({
      music: app.globalData.musicStatus == 1 ? false : true,
      height: app.globalData.height,
      barHeight: app.globalData.barHeight,
    })

    if (app.globalData.barHeight < 44) {
      topArray = [4, 2, 5, 3, 4, 5, 3]
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    console.log("iiii");
    console.log(app.globalData.musicStatus);
    i = 0;
    let that = this;
    pages = this;
    doommLists = [];


    this.music(app.globalData.musicStatus);

    this.setData({
      doommData: [],
      dataList: []
    })
    clearInterval(app.globalData.inter);
    clearInterval(app.globalData.timeOutdata);
    this.bindbt();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    i = 0;
    clearInterval(app.globalData.inter);
    clearInterval(app.globalData.timeOutdata);
    clearInterval(this.data.setInter);
    clearInterval(this.data.timeOutdata);
    doommLists = [];
    this.setData({
      doommData: [],
      dataList: []
    })

    i = 0;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
      app.globalData.musicStatus = 0
    }
    console.log(status)
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
      var dataList = pages.data.dataList;
      var doommData = pages.data.doommData;
      if (doommData.length > 7) {
        doommData.splice(0, 2);
        var data = dataList.splice(0, 1);
        doommData.push(data[0])
        pages.setData({
          doommData: doommData,
          dataList: dataList
        })
      } else {
        var data = dataList.splice(0, 1);
        doommData.push(data[0])
        pages.setData({
          doommData: doommData,
          dataList: dataList
        })
      }
    }, 3000)
    //记下定时器
    this.setData({
      setInter: setInter,
      timeOutdata: timeOutdata
    })
    app.globalData.inter = setInter;
    app.globalData.timeOutdata = timeOutdata
  },
  updateContent(event) {
    if (event.detail.value.length > 88) {
      this.setData({
        content: this.data.content
      })
      return false;
    }
    this.setData({
      currentWordNumber: event.detail.value.length,
      content: event.detail.value
    })
  }, actionMusic() {

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

  autoWish(event) {
    this.setData({
      content: event.currentTarget.dataset.text,
      currentWordNumber: event.currentTarget.dataset.text.length
    })
  },
  publish() {
    console.log("来了")
    let that = this;
    if (this.data.datalock == 1) {
      return false;
    }

    if (!this.data.content) {
      wx.showLoading({
        title: '请输入您的愿望',
        duration: 1500
      })

      return false;
    }
    wx.showLoading({
      title: '请稍后',
    })
    this.setData({
      datalock: 1
    })
    var data = {
      text: this.data.content
    };
    util.request(WISH_CREATE, data, 'POST').then(res => {
      if (res.code == 200) {
        wx.hideLoading()


        var doomData = this.data.doommData

        doomData.push(new Doomm(wx.getStorageSync("user").avatar, this.data.content, 26, Math.floor(Math.random() * 10, 3), getRandomColor()));
        that.setData({
          doommData: doomData
        })
        setTimeout(function () {
          that.setData({
            datalock: 0,
            content: "",
            currentWordNumber: 0,
            showSuccess: true
          })








        }, 1500)



      } else {
        wx.hideLoading()
        that.setData({
          datalock: 0
        })
      }

    });
  },
  close() {
    this.setData({
      showSuccess: false
    })
  },
  getWish() {
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
            dataList.push(new Doomm(res.body.wishList[i].avatar, res.body.wishList[i].text, i, Math.floor(Math.random() * 10, 3), getRandomColor()));
          }
          that.setData({
            totalNum: res.body.totalNum,
            currentPageIndex: that.data.currentPageIndex + 1,
            dataList: dataList
          })
        }
      } else {
      }
    });
  },
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
    options.currentPageIndex = 10;
    options.perPageNum = 5;
    util.request(WISH_CREATE, options, 'GET').then(res => {
      if (res.code == 200) {
        var dataList = this.data.dataList;
        for (let i = 0; i < res.body.wishList.length; i++) {
          dataList.push(new Doomm(res.body.wishList[i].avatar, res.body.wishList[i].text, i, Math.floor(Math.random() * 10, 3), getRandomColor()));
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
  //滑动移动事件
  handletouchmove: function (event) {
    var currentX = event.touches[0].pageX
    var currentY = event.touches[0].pageY
    var tx = currentX - this.data.lastX
    var ty = currentY - this.data.lastY
    var text = ""
    //左右方向滑动
    if (Math.abs(tx) > Math.abs(ty)) {
      if (tx < 0)
        text = "向左滑动"
      else if (tx > 0)
        text = "向右滑动"
      setTimeout(function () { }, 1000)

    }
    //上下方向滑动
    else {
      if (ty < 0)
        text = "向上滑动"
      else if (ty > 0)
        text = "向下滑动"
    }

    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX
    this.data.lastY = currentY
    this.setData({
      text: text,
    });
  },

  //滑动开始事件
  handletouchtart: function (event) {
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },
  //滑动结束事件
  handletouchend: function (event) {
    this.data.currentGesture = 0;
    this.setData({
      text: "没有滑动",
    });
  },
})

var doommLists = [];
var topArray = [3, 2, 4, 2, 3]
var flag = false;
var i = 0;
class Doomm {
  constructor(avatar, text, top, time, color) {

    if (topArray.length < 2) {
      if (pages.data.barHeight < 44) {
        topArray = [3, 4, 2, 2, 3,]
      } else {
        topArray = [2, 3, 4, 2, 3, 5]
      }
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
    if (pages.data.barHeight < 44) {
      top = top * 5 + 3;
    } else {
      top = top * 6 + 3;
    }

    if (topArray.length < 1) {
      topArray.unshift(3)
    }
    if (pages.data.barHeight < 44) {
      top = top - 2;
    } else {
      top = top - 5;
    }
    if (i == 0) {
      this.self = 1;
      if (pages.data.barHeight < 44) {
        top = 17
      } else {
        top = 24
      }

    }

    if (pages.data.height < 814) {
      top = top - 2;
    } else {
      top = top - 6;
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