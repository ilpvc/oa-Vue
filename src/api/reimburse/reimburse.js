import service from "@/utils/request";
import {getConfigByName} from "@/api/configType/configType";
import store from "@/store";

//查询所有的部门
export function allReimburse() {
    return service({
        url: '/oa/reimburse/allReimburse',
        method: 'get'
    })
}

//分页查询部门
export function pageReimburse(pageNo, pageCount) {

    return service({
        url: `/oa/reimburse/pageReimburse/${pageNo}/${pageCount}`,
        method: 'get'
    })

}

//根据id删除部门的api请求
export function deleteReimburse(id) {
    return service({
        url: `/oa/reimburse/${id}`,
        method: 'delete'
    })
}

export function getReimburseById(id) {
    return service({
        url: `/oa/reimburse/${id}`,
        method: 'get'
    })
}

export async function saveReimburse(reimburse) {
    let res = await getConfigByName(reimburse.reimburseType)
    let status = store.state.reimburseStore.reimburseStatus
    let statusKey = null
    let allEmployeeData = store.state.empStore.allEmployeeData
    for (const [key, value] of status) {
        if (value === reimburse.reimburseStatus) {
            statusKey = key
            break
        }
    }
    let k = reimburse.reimburseUser.split(" ")
    for (const [key,value] of allEmployeeData) {
        if (value.empNo===k[0]){
            k[1]=key
        }
    }
    const data = {
        ...reimburse,
        reimburseStatus: statusKey,
        reimburseTypeId: res.data.item.configId,
        reimburseUserNo: k[1],
    }

    return service({
        url: '/oa/reimburse/addReimburse',
        method: 'post',
        data: data
    })
}

/**
 *
 * @param reimburse 需要更新的数据
 * @param id    根据id更新
 * @returns {Promise<*>}
 */
export async function updateReimburse(reimburse, id) {
    //根据名字获取类型
    let res = await getConfigByName(reimburse.reimburseType)
    let status = store.state.reimburseStore.reimburseStatus
    let statusKey = null
    for (const [key, value] of status) {
        if (value === reimburse.reimburseStatus) {
            statusKey = key
            break
        }
    }
    let k = reimburse.reimburseUser.split(" ")
    const data = {
        id,
        ...reimburse,
        reimburseStatus: statusKey,
        reimburseTypeId: res.data.item.configId,
        reimburseUserNo: k[1],
    }

    return service({
        url: '/oa/reimburse/updateReimburse',
        method: 'put',
        data: data
    })
}


export async function updateReimburseSimple(reimburse, id){
    let data={
        id,
        ...reimburse
    }
    return service({
        url: '/oa/reimburse/updateReimburse',
        method: 'put',
        data: data
    })
}

export function getReimburseByName(name) {
    return service({
        url: `/oa/reimburse/getOne/${name}`,
        method: 'get'
    })
}


export function getReimburseByStatus(pageNo, pageCount, status) {
    const data = {
        reimburseStatus: status
    }
    return service({
        url: `/oa/reimburse/pageConfigCondition/${pageNo}/${pageCount}`,
        method: 'post',
        data: data
    })
}
