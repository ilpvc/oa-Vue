import {allConfig} from "@/api/configType/configType";


const state = {
    configInfo: null,
    configNameMap:null,
}
const mutations = {
    SET_CONFIG_INFO(state, dataInfo) {
        state.configInfo = dataInfo
    },
    SET_CONFIG_NAME_MAP(state, dataInfo){
        state.configNameMap = dataInfo
    }
}
const actions = {
    setConfigInfo({commit}) {
        let configInfo = new Map
        let configName = new Map
        allConfig().then(res => {
            let items = res.data.items
            for (const item of items) {
                configInfo.set(item.configId,item)
                configName.set(item.configId,item.configName)
            }
            commit('SET_CONFIG_INFO', configInfo)
            commit('SET_CONFIG_NAME_MAP', configName)

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