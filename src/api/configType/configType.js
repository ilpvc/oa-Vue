import service from "@/utils/request";

//查询所有的部门
export function allConfig(){
    return service({
        url:'/oa/config/allConfig',
        method: 'get'
    })
}

//分页查询部门
export function pageConfig(pageNo,pageCount){

    return service({
        url:`/oa/config/pageConfig/${pageNo}/${pageCount}`,
        method:'get'
    })

}

//根据id删除部门的api请求
export function deleteConfig(id){
    return service({
        url:`/oa/config/${id}`,
        method: 'delete'
    })
}

export function getConfigById(id){
    return service({
        url:`/oa/config/getConfig/${id}`,
        method:'get'
    })
}

export async function saveConfig(config){
    let res = await getConfigByName(config.belongConfig)
    config.configPid = res.data.item.configId
    const data={
        ...config
    }

    return service({
        url:'/oa/config/addConfig',
        method:'post',
        data: data
    })
}

/**
 *
 * @param config 需要更新的数据
 * @param id    根据id更新
 * @returns {Promise<*>}
 */
export async function updateConfig(config,id){
    //根据所属部门名称查询所属部门的id
    let res = await getConfigByName(config.belongConfig)
    config.configPid = res.data.item.configId
    const data={
        id,
        ...config
    }

    return service({
        url:'/oa/config/updateConfig',
        method:'put',
        data: data
    })
}

export function getConfigByName(name){
    return service({
        url:`/oa/config/getOne/${name}`,
        method:'get'
    })
}
