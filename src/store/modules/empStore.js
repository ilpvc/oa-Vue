import {allEmployee} from "@/api/employee/employee";


const state = {
    allEmpNoAndName: [],
    allEmpNoAndNameMap: null,
    allEmployeeData: null,
    allEmpNameMap:null,
    allEmpNoMap:null,
}
const mutations = {
    SET_ALL_EMP_AND_NAME(state, dataInfo) {
        state.allEmpNoAndName = dataInfo
    },
    SET_ALL_EMPLOYEE_DATA(state, dataInfo){
        state.allEmployeeData = dataInfo
    },
    SET_ALL_EMP_NAME_MAP(state, dataInfo){
        state.allEmpNameMap = dataInfo
    },
    SET_ALL_EMP_NO_MAP(state, dataInfo){
        state.allEmpNoMap = dataInfo
    },
    SET_ENANM(state, dataInfo){
        state.allEmpNoAndNameMap = dataInfo
    }
}
const actions = {
    setAllEmpNoAndName({commit}) {
        let AENN =[]
        let AED=new Map
        let empNameMap= new Map
        let empNoMap = new Map
        let empNoAndNameMap = new Map
        allEmployee().then(res => {
            let items = res.data.items
            for (const item of items) {
                AENN.push(item.empNo+" "+item.empName)
                AED.set(item.empId,item)
                empNameMap.set(item.empId,item.empName)
                empNoMap.set(item.empId,item.empNo)
                empNoAndNameMap.set(item.empId,item.empNo+"-"+item.empName)
            }
            commit('SET_ALL_EMP_AND_NAME', AENN)
            commit('SET_ALL_EMPLOYEE_DATA', AED)
            commit('SET_ALL_EMP_NAME_MAP',empNameMap)
            commit('SET_ALL_EMP_NO_MAP',empNoMap)
            commit('SET_ENANM',empNoAndNameMap)

        })
    },

}

const getter = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getter
}