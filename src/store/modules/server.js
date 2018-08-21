import { getReturnApplyInfo } from '@/api/server'
import { getExpressCompanys } from '@/api/order'
const server = {
  state: {
    serviceInfo: {
      serviceType: 0,
      price: '62',
      orderNo: '201808031434010001002',
      skuList: [
        {
          color: '白色',
          id: 463,
          skuId: 19714,
          img: 'https://weappstatic1.j.cn/img/mrxk/180731/1021/7ec4c45c946811e8.jpg',
          price: '62',
          quantity: 1,
          size: 'XS',
          title: '韩都衣舍2018夏装新款女装韩版宽松印花镂空上衣短袖T恤KY0056湲',
          productId: 4205,
          afterSaleStatus: -1
        }
      ],
      quantity: 1,
      status: 5,
      shop: { id: 2, name: '韩都衣舍' },
      id: 463,
      duringAfterSale: false,
      afterSaleStatus: 2,
      payTime: '2018-08-03 14:34:07',
      sendTime: '',
      receiveTime: '',
      addressInfo: {
        id: 22,
        addrProvince: '北京市',
        addrCity: '北京市',
        addrDistrict: '昌平区',
        addrDetail: '回龙观新龙城3期36E号楼1单元101',
        name: '翟培伸',
        tel: '17801111226'
      }
    }, // 售后信息
    returnApplyInfo: null,
    proofUrlList: [], // 售后上传的图片凭证
    returnLogList: [], // 售后进度timeline
    expressArr: [] // 物流公司列表
  },

  mutations: {
    SET_SERVICE_INFO: (state, serviceInfo) => {
      state.serviceInfo = serviceInfo
    },
    SET_RETURN_INFO: (state, returnApplyInfo) => {
      state.returnApplyInfo = returnApplyInfo
    },
    SET_PROOF_LIST: (state, proofUrlList) => {
      state.proofUrlList = proofUrlList
    },
    SET_RETURN_LOG: (state, returnLogList) => {
      state.returnLogList = returnLogList
    },
    SET_EXPRESS_ARR: (state, expressArr) => {
      state.expressArr = expressArr
    }
  },
  actions: {
    // 获取售后信息
    GetReturnApplyInfo: ({ commit }, params) => {
      return new Promise((resolve, reject) => {
        console.log(params)
        getReturnApplyInfo(params)
          .then(res => {
            commit('SET_RETURN_INFO', res.data.returnApplyInfo)
            commit('SET_PROOF_LIST', res.data.returnApplyInfo.proofUrl.split(','))
            commit('SET_RETURN_LOG', res.data.returnApplyInfo.returnLogList.reverse())
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取物流公司列表
    GetExpressCompanys: ({ commit }) => {
      return new Promise((resolve, reject) => {
        getExpressCompanys()
          .then(res => {
            commit('SET_EXPRESS_ARR', res.data.list)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default server
