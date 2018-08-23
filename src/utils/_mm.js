// 工具类
import qiniu from './_qiniu'
import axios from 'axios'


function accMul(arg1, arg2) {
  if (isNaN(arg1)) {
    arg1 = 0
  }
  if (isNaN(arg2)) {
    arg2 = 0
  }
  arg1 = Number(arg1)
  arg2 = Number(arg2)

  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}

Number.prototype.add = function(arg) {
  var r1, r2, m
  try {
    r1 = this.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (this * m + arg * m) / m
}
// 乘法
Number.prototype.mul = function(arg) {
  return accMul(this, arg)
}

Array.prototype.diff = function(a, key) {
  return this.filter(function(item) {
    return !a.some(function(ele) {
      return ele[key] === item[key]
    })
  })
}
export function _arrQc(objArr, key) {
  var arr = []
  var newArr = []
  var newArr1 = []
  for (let v of objArr) {
    arr.push(v[key])
  }
  for (var i = 0; i < arr.length; i++) {
    if (newArr.indexOf(arr[i]) < 0) {
      newArr.push(arr[i])
      newArr1.push(objArr[i])
    }
  }
  return newArr1
}

export function _getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export function _getQueryStringFromUrl(url, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = url.split('?')[1].substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export function fileUpload(vm,filePath, data, succ, err) {
  //支服务器拿token,成功后开始七牛上传
  let isTimeout = false
  let uploadTimeout = setTimeout(function() {
    isTimeout = true
    vm.$loading.hide()
    vm.$toast('上传超时')
  }, 30000)

  axios({
    method: 'post',
    data: data,
    url: 'https://kryptontest.j.cn/api/common/getUploadInfo'
  }).then(jsonToken => {
    qiniu.upload(
      filePath,
      function(qiniuRes) {
        clearTimeout(uploadTimeout)
        if (isTimeout) {
          console.log('虽然上传成功了，但是超时了，不做后续操作')
          return
        }
        vm.$loading.hide()
        succ({
          resUrl: jsonToken.data.uploadInfoList[0].finalUrl,
          status: qiniuRes
        })
        vm.$toast('上传成功')
      },
      function(error) {
        err(error)
      },
      {
        region: 'ECN',
        key: jsonToken.data.uploadInfoList[0].key,
        uptoken: jsonToken.data.uploadInfoList[0].token
      }
    )
  })
}
