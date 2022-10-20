
    const state = {
        token:""
    }
    const mutations={
        changeToken(state,token){
            state.token = token
        }
    }
    const actions = {

    }

export default {
    namespaced:true,
    state,
    mutations,
    actions
}