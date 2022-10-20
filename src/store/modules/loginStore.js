
const state = {
    token: null,

}
const mutations = {
    SET_TOKEN(state, dataInfo) {
        state.token = dataInfo
    }
}
const actions = {
    setToken({commit},value) {
        let token =value
        commit('SET_TOKEN', token)

    },
    removeToken({commit}){
        let token=undefined
        commit('SET_TOKEN', token)
    }

}

const getter = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getter
}