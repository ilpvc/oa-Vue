import service from "@/utils/request";
import store from "@/store";
//查询所有的部门
export function allDept(){
    return service({
        url:'/oa/dept/allDept',
        method: 'get'
    })
}

//分页查询部门
export function pageDept(pageNo,pageCount){

    return service({
        url:`/oa/dept/pageDept/${pageNo}/${pageCount}`,
        method:'get'
    })

}

//根据id删除部门的api请求
export function deleteDept(id){
    return service({
        url:`/oa/dept/${id}`,
        method: 'delete'
    })
}

export function getDeptById(id){
    return service({
        url:`/oa/dept/getDept/${id}`,
        method:'get'
    })
}

export async function saveDept(dept){
    let deptsMap = store.state.deptStore.deptsMap
    for (const [key,value] of deptsMap) {
        if (dept.belongDept===value){
            dept.deptPid = key
            break
        }
    }
    const data={
        ...dept
    }
    return service({
        url:'/oa/dept/addDept',
        method:'post',
        data: data
    })
}

/**
 *
 * @param dept 需要更新的数据
 * @param id    根据id更新
 * @returns {Promise<*>}
 */
export async function updateDept(dept,id,deptUserNo){
    //根据所属部门名称查询所属部门的id
    let deptsMap = store.state.deptStore.deptsMap
    let empNoMap = store.state.empStore.allEmpNoMap
    let k
    for (const [key,value] of deptsMap) {
        if (dept.belongDept===value){
            dept.deptPid = key
            break
        }
    }
    for (const [key,value] of empNoMap) {
        if (value ===deptUserNo){
             k=key
            break
        }
    }
    const data={
        id,
        ...dept,
        deptUser:k
    }

    return service({
        url:'/oa/dept/updateDept',
        method:'put',
        data: data
    })
}

export function getDeptByName(name){
    return service({
        url:`/oa/dept/getOne/${name}`,
        method:'get'
    })
}
