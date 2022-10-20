import {allMenu} from "@/api/menu";

const state = {
    menu: null,
    menuParent:null
}

const mutations = {
    SET_MENU(state, dataInfo) {
        state.menu = dataInfo
    }
}

const actions = {
    setMenu({commit}){
        allMenu().then(res=>{
            let items = res.data.items
            let map =new Map()
            for (const item of items) {
                map.set(item.menuId,item)
            }

            commit('SET_MENU',map)
        })
    }
}

// const getters= {
//     menuName(state,id){
//         let menu = state.menuStore.menu
//         return menu.get(id)
//         // console.log(state.menuStore.menu)
//
//     }
// }


export default {
    namespaced: true,
    state,
    mutations,
    actions
}