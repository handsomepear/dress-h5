const element = {
  state: {
    name: 'element',
    isShowTabBar: true,
    direction: '',
    mineTab: 'order'
  },

  mutations: {
    HIDE_TABBAR: state => {
      state.isShowTabBar = false
    },
    SHOW_TABBAR: state => {
      state.isShowTabBar = true
    },
    UPDATE_DIRECTION: (state, params) => {
      state.direction = params.direction
    },
    SET_MINE_TAB: (state, tabName) => {
      state.mineTab = tabName
    }
  },
  actions: {}
}

export default element
