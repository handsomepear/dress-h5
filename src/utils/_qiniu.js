import * as qiniu from 'qiniu-js'
import axios from 'axios'
export default function fileUpload(vm,file, cb) {
  vm.$loading.show()
  axios({
    method: 'post',
    url: 'https://kryptontest.j.cn/api/common/getUploadInfo',
    data: {
      keys: '',
      mimeType: 'image',
      suffixes: 'jpg'
    }
  }).then(res => {
    let token = res.data.uploadInfoList[0].token
    let key = res.data.uploadInfoList[0].key
    let finalUrl = res.data.uploadInfoList[0].finalUrl
    let config = {
      useCdnDomain: true
    }
    let putExtra = {
      fname: '',
      params: {},
      mimeType: null
    }
    let observer = {
      next(res) {
      },
      error(err) {
        vm.$toast('上传失败请重试')
      },
      complete() {
        vm.$loading.hide()
        cb(finalUrl)
      }
    }
    let observable = qiniu.upload(file, key, token, putExtra, config)
    observable.subscribe(observer)
  })
}
