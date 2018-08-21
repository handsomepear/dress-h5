const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/pages/dressmalltest/' : '/',
  assetsDir: 'assets'
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://kryptontest.j.cn',
  //       secure: false
  //     }
  //   }
  // }
}
