import * as types from './mutations-type'

const state = {
  paperInformation: {},
  prevPage: ''
}

const actions = {
  PAPER_INFORMATION ({commit}, object) {
    commit(types.PAPER_INFORMATION, object)
  },
  PREVIOUS_PAGE ({commit}, object) {
    commit(types.PREVIOUS_PAGE, object)
  }
}

const mutations = {
  [types.PAPER_INFORMATION] (state, object) {
    state.paperInformation = object
  },
  [types.PREVIOUS_PAGE] (state, object) {
    state.prevPage = object
  }
}
const getters = {
  getPaperInfomationCache (state) {
    return state.paperInformation
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
