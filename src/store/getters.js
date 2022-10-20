

const getters = {
    token: state => state.token,
    depts: state => state.depts,
    menuName(state){
        let menu = state.menuStore.menu
        return function (id){
            return menu.get(id)
        }


    }

}

export default getters