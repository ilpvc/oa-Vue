import service from "@/utils/request";
import store from "@/store";
/**
 * 查询所有的员工
 * @returns {*}
 */
export function allClazz(){
    return service({
        url:'/oa/class/allClass',
        method: 'get',
    })
}

/**
 *  分页查询
 * @param pageNo 当前页
 * @param pageCount 每页数量
 * @returns {*}
 */
export function pageClazz(pageNo,pageCount){
    return service({
        url:`/oa/class/pageClass/${pageNo}/${pageCount}`,
        method:'get'
    })
}

export function delClazz(id){
    return service({
        url:`/oa/class/${id}`,
        method:'delete'
    })
}

export async function saveClass(clazz){
    const empNoMap = store.state.empStore.allEmpNoMap
    let classUser
    for (const [key,value] of empNoMap) {
        if (value===clazz.classUser.split("-")[0]) classUser = key
    }
    const data={
        ...clazz,
        classUser
    }

    return service({
        url:'/oa/class/addClass',
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
export async function updateClass(clazz,id){
    const empNoMap = store.state.empStore.allEmpNoMap
    let classUser
    for (const [key,value] of empNoMap) {
        if (value===clazz.classUser.split("-")[0]) classUser = key
    }
    const data={
        id,
        ...clazz,
        classUser
    }

    return service({
        url:'/oa/class/updateClass',
        method:'put',
        data: data
    })
}


export function getClassById(id){
    return service({
        url:`/oa/class/getClass/${id}`,
        method:'get'
    })
}