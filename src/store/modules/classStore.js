import {allClazz} from "@/api/class/class";

const state = {
    allClassName: null,
    allClassNoAndNameMap: null,
    allClassNoAndName:[]
}
const mutations = {
    SET_ALL_CLASS_NAME(state, dataInfo) {
        state.allClassName = dataInfo
    },
    SET_ALL_CLASS_NO_AND_NAME_MAP(state, dataInfo) {
        state.allClassNoAndNameMap = dataInfo
    },
    SET_ALL_CLASS_NO_AND_NAME(state, dataInfo) {
        state.allClassNoAndName = dataInfo
    }
}
const actions = {
    setClass({commit}) {
        let className =new Map
        let classNoAndNameMap = new Map
        let classNoAndName = []
        allClazz().then(res => {
            let items = res.data.items
            for (const item of items) {
                className.set(item.classId,item.className)
                classNoAndNameMap.set(item.classId, item.classNo+"-"+item.className)
                classNoAndName.push(item.classNo+"-"+item.className)
            }
            commit('SET_ALL_CLASS_NAME', className)
            commit('SET_ALL_CLASS_NO_AND_NAME_MAP', classNoAndNameMap)
            commit('SET_ALL_CLASS_NO_AND_NAME',classNoAndName)
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