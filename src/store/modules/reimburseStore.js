const state = {
    reimburseTypes: null,
    reimburseStatus: null
}

const mutations = {
    SET_REIMBURSE_TYPES(state, dataInfo) {
        state.reimburseTypes = dataInfo
    },
    SET_REIMBURSE_STATUS(state, dataInfo){
        state.reimburseStatus = dataInfo
    }
}

const actions = {
    setReimburseTypes({commit}) {
        let map = new Map
        map.set(1, "住宿费")
        map.set(2, '交通费')
        map.set(3, '差旅费')
        map.set(4, "招待费")
        map.set(5, '办公费')
        map.set(6, "项目费")
        commit('SET_REIMBURSE_TYPES', map)
    },
    setReimburseStatus({commit}){
        let map = new Map
        map.set(1, "草稿")
        map.set(2, '提交')
        map.set(3, '同意')
        map.set(4, "驳回")
        commit('SET_REIMBURSE_STATUS', map)
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}