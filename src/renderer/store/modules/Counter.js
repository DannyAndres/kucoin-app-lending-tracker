const state = {
  main: 1000 * 60 * 5, // second * 60 * 5 -> 5 minutes,
  update: false,
  updategraph: false
}

const getters = {
  getInterval (state) {
    return state.main
  },
  getUpdate (state) {
    return state.update
  },
  getUpdategraph (state) {
    return state.updategraph
  }
}

const mutations = {
  update (state) {
    state.update = true
  },
  stop (state) {
    state.update = false
  },
  updategraph (state) {
    state.updategraph = true
  },
  stopgraph (state) {
    state.updategraph = false
  }
}

const actions = {
  update ({ commit }) {
    commit('update')
  },
  stop ({ commit }) {
    commit('stop')
  },
  updategraph ({ commit }) {
    commit('updategraph')
  },
  stopgraph ({ commit }) {
    commit('stopgraph')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
