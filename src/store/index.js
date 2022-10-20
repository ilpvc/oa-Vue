import {createStore} from "vuex";
import deptStore from "@/store/modules/deptStore";
import appStore from "@/store/modules/appStore";
import roleStore from "@/store/modules/roleStore";
import menuStore from "@/store/modules/menuStore";
import userStore from "@/store/modules/userStore";
import reimburseStore from "@/store/modules/reimburseStore";
import allConfigStore from "@/store/modules/allConfigStore";
import empStore from "@/store/modules/empStore";
import classStore from "@/store/modules/classStore";
import getters from "@/store/getters";
import loginStore from "@/store/modules/loginStore";

const store = new createStore({
    modules:{
        deptStore,
        appStore,
        roleStore,
        menuStore,
        userStore,
        reimburseStore,
        allConfigStore,
        empStore,
        classStore,
        loginStore
    },
    getters
})

export default store