import Loading from '@/components/Loading.vue'

let $vm
const loading = {
  install(Vue, options) {
    if (!$vm) {
      const LoadingPlugin = Vue.extend(Loading)
      $vm = new LoadingPlugin({
        el: document.createElement('div')
      })
      document.body.appendChild($vm.$el)
    }

    $vm.show = false

    let loading = {
      show() {
        $vm.show = true
      },
      hide() {
        $vm.show = false
      }
    }

    if(!Vue.$loading) {
      Vue.$loading = loading
    }

    Vue.mixin({
      created(){
        this.$loading = Vue.$loading
      }
    })
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(loading)
}

export default loading
