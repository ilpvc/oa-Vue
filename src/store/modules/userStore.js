

const state = {
    statusInfo:null,
    loginUser:null
}

const mutations={
    SET_STATUS_INFO(state,dataInfo){
        state.statusInfo = dataInfo
    },
    SET_LOGIN_USER(state,dataInfo){
        state.loginUser = dataInfo
    },
    REMOVE_LOGIN_USER(state){
      state.loginUser = null
    }
}

const actions={
    setStatusInfo({commit}){
        let map = new Map
        map.set(0,"正常")
        map.set(1,'禁用')
        map.set(2,'删除')
        commit('SET_STATUS_INFO',map)
    },

    setLoginUser({commit},dataInfo){
        commit('SET_LOGIN_USER',dataInfo)
    },

    removeLoginUser({commit}){
        commit('REMOVE_LOGIN_USER')
    }
}
export default {
    namespaced:true,
    state,
    mutations,
    actions
}