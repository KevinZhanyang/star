// pages/poster/index.js
let app = getApp();
var uploadImage = require('../../util/uploadFile.js');
var util = require("../../util/util.js");
var ttt = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "你好",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let that = this;
    this.sys();
    this.setData({
      totalNum: options.totalNum,
      content: options.wish,
      height: app.globalData.height,
      barHeight: app.globalData.barHeight,
      avatarUrl: app.globalData.acvtarUrl,
      username: wx.getStorageSync("user").nickname,
    })
    this.setData({
      music: app.globalData.musicStatus == 1 ? false : true,
      height: app.globalData.height,
      barHeight: app.globalData.barHeight,
    })
  },
  sys: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight,
          canvasWidth: res.screenWidth / 750 * 750,
          canvasHeight: res.screenWidth / 750 * app.globalData.height*1.7
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    if (wx.getStorageSync("shareImg")){
        this.setData({
          canvasIndex:0,
          saveImg: wx.getStorageSync("shareImg")
        })
        return false;
    }
   

    var canvas = wx.createCanvasContext('shareCanvas');
    wx.showLoading({
      title: '生成中',
    })
    ttt = setInterval(function() {
      if (that.data.canvasimgbg && that.data.avatarUrl) {
        wx.hideLoading();
        that.canvasdraw(canvas);
        clearInterval(ttt);
      } else {
        if (app.globalData.acvtarUrl) {
          that.setData({
            canvasimgbg: '/images/share.jpg',
            avatarUrl: app.globalData.acvtarUrl,
          })
        }
      }
    }, 1000)
  },

  canvasdraw: function(canvas) {
    var that = this;
    var windowW = that.data.canvasWidth;
    var windowH = that.data.canvasHeight;
    var canvasimgbg = that.data.canvasimgbg;
    var avatar = that.data.avatarUrl;
    canvas.drawImage(canvasimgbg, 0, 0, that.data.canvasWidth * 0.88, that.data.height * 0.88);

    if (this.data.height==812){
      /**   头像 */
      canvas.drawImage(avatar, that.data.canvasWidth * 0.15 + 1.3, that.data.canvasHeight * 0.21 +16.2, that.data.canvasWidth * 0.14, that.data.canvasWidth * 0.14);
      /**   昵称 */
      canvas.setFontSize(14)
      canvas.fillStyle = "#fff";
      if (this.data.username > 4) {
        canvas.fillText(this.data.username.slice(0, 4) + "...", that.data.canvasWidth * 0.14+2 , that.data.canvasHeight * 0.3 + 24);
      } else {
        canvas.fillText(this.data.username, that.data.canvasWidth * 0.14+2, that.data.canvasHeight * 0.3 +24)
      }
      var total;
      //数量
      if ((that.data.totalNum + "") > 6) {
        var num = 6 - (that.data.totalNum + "").length
        var zeroNum = "";
        for (var i = 0; i < num; i++) {
          zeroNum = zeroNum + 0 + "";
        }
      }
      console.log(that.data.totalNum)
      total = "第"+zeroNum + "" + that.data.totalNum
      canvas.setFontSize(18)
      canvas.fillStyle = "#fff";
      canvas.fillText(total, that.data.canvasWidth * 0.5-22, that.data.canvasHeight * 0.3 +8.5 )
    }else{
      /**   头像 */
      canvas.drawImage(avatar, that.data.canvasWidth * 0.15 + 1.3, that.data.canvasHeight * 0.21-8, that.data.canvasWidth * 0.14, that.data.canvasWidth * 0.14);
      /**   昵称 */
      canvas.setFontSize(14)
      canvas.fillStyle = "#fff";
      if (this.data.username > 4) {
        canvas.fillText(this.data.username.slice(0, 4) + "...", that.data.canvasWidth * 0.14 + 2, that.data.canvasHeight * 0.3);
      } else {
        canvas.fillText(this.data.username, that.data.canvasWidth * 0.14 + 2, that.data.canvasHeight * 0.3)
      }
      var total;
      //数量
      if ((that.data.totalNum + "") > 6) {
        var num = 6 - (that.data.totalNum + "").length
        var zeroNum = "";
        for (var i = 0; i < num; i++) {
          zeroNum = zeroNum + 0 + "";
        }
      }
      console.log(that.data.totalNum)
      total = "第" + zeroNum + "" + that.data.totalNum
      canvas.setFontSize(18)
      canvas.fillStyle = "#fff";
      canvas.fillText(total, that.data.canvasWidth * 0.5 - 22, that.data.canvasHeight * 0.3 -18)
    }
   
    canvas.draw(false, setTimeout(function() {
      that.daochu();
    }, 500));
  },

  daochu: function() {
    console.log('a');
    var that = this;
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      success: function(res) {
        // that.setData({ canvasIndex:0})
        console.log(res)
        that.upload(res);
      },
      error: function(err) {
        console.log(err)
      }
    })
  },
  hideFilter(){
    wx.navigateBack({
      
    })
  }
  ,
  _backhome(){
     wx.redirectTo({
       url: '/pages/index/index',
     })
  },
  upload(res) {
    console.log('b');
    let that = this;
    var nowTime = util.formatTime(new Date());
    console.log(res.tempFilePath);
    that.setData({
      saveImg: res.tempFilePath
    })
    wx.setStorageSync("shareImg", res.tempFilePath)
    //上传图片
    //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
    //图片路径可自行修改
    uploadImage(res.tempFilePath, 'cbb/' + nowTime + '/',
      function(result) {
        console.log("======上传成功图片地址为：", result);
        that.setData({
          qrcodeUrl: result,
        })
       
        wx.hideLoading();
      },
      function(result) {
        console.log("======上传失败======", result);
        wx.hideLoading()
      }
    )
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  saveImg() {
    let that = this;
    wx.hideLoading()
    wx.saveImageToPhotosAlbum({
      filePath: that.data.saveImg,
      success: (res) => {
        wx.showLoading({
          title: '保存成功',
          duration: 1500,
        })
      },
      fail: (err) => {

        wx.showLoading({
          title: '保存失败',
          duration: 1500,

        })

      }
    })





  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})