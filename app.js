App({
  globalData: {
    height: 0,
    inter:0,
    timeOutdata:0
  },
 onLaunch(){
   this.AppMusic = wx.createInnerAudioContext();
   this.AppMusic.autoplay = true;
   this.AppMusic.loop = true;
   this.AppMusic.onPlay(() => {
     console.log('开始播放')
   })
   this.AppMusic.onError((res) => {
     console.log(res)
     console.log(res)
   })
   this.AppMusic.seek(60);
   this.AppMusic.src = 'https://used-america.oss-us-west-1.aliyuncs.com/HAUSER%2B-%2BMia%2B%26%2BSebastian%E2%80%99s%2BTheme%2B-%2BLa%2BLa%2BLand%2000_00_00-00_00_17.mp3'
   wx.getSystemInfo({
     success: (res) => {
       console.log(res)
       this.globalData.height = res.screenHeight;
       this.globalData.barHeight = res.statusBarHeight;
     }
   })
 },

music(e) {
    let that = this;

    if (status==1) {
      app.AppMusic.pause();
      app.AppMusic.onPause(() => {
        console.log('暂停播放');
        that.setData({
          status: false
        })
      })
    } else {
      app.AppMusic.play();
      app.AppMusic.onPlay(() => {
        console.log('开始播放');
        that.setData({
          status: true
        })
      })
    }
    console.log(e)

  },
 

})