import {allRole} from "@/api/role/role";
const state = {
    roles: null,
    allRolesName: null
}

const mutations = {
    SET_ROLES(state, dataInfo) {
        state.roles = dataInfo
    },
    SET_ALL_ROLES_NAME(state,dataInfo){
        state.allRolesName = dataInfo
    }
}

const actions = {
    setRoles({commit}){
        allRole().then(res=>{
            let items = res.data.items
            let allRolesName=[]
            let map =new Map()
            for (const item of items) {
                map.set(item.roleId,item.roleName)
                allRolesName.push(item.roleName)
            }

            commit('SET_ROLES',map)
            commit('SET_ALL_ROLES_NAME',allRolesName)
        })
    },
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}