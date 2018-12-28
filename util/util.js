var api = require('../lib/api.js');

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': "application/json",
        'token': wx.getStorageSync('token') == "" || wx.getStorageSync('token') == null ? "" : wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else if (res.statusCode == 401) {

          wx.showToast({
            title: '登陆已过期',
          })
          wx.navigateTo({
            url: '/pages/auth/index',
          })
        }

      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  });
}
module.exports = {
 
  request,

}