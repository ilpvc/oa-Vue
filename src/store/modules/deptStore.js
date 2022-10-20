import {allDept} from "@/api/dept/dept";

const state = {
    depts: [],
    deptsMap: null
}
const mutations = {
    SET_DEPTS(state, depts) {
        state.depts = depts
    },
    SET_DEPTS_MAP(state, dataInfo) {
        state.deptsMap = dataInfo
    }
}
const actions = {
    setDepts({commit}) {
        let depts = []
        let deptsMap = new Map
        allDept().then(res => {
            let items = res.data.items
            for (const item of items) {
                depts.push(item.deptName)
                deptsMap.set(item.deptId, item.deptName)
            }
            commit('SET_DEPTS', depts)
            commit('SET_DEPTS_MAP', deptsMap)
        })
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