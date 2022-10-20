import service from "@/utils/request";

//查询所有的部门
export function allRole(){
    return service({
        url:'/oa/role/allRole',
        method: 'get'
    })
}

//分页查询部门
export function pageRole(pageNo,pageCount){

    return service({
        url:`/oa/role/pageRole/${pageNo}/${pageCount}`,
        method:'get'
    })

}

//根据id删除部门的api请求
export function deleteRole(id){
    return service({
        url:`/oa/role/${id}`,
        method: 'delete'
    })
}

export function getRoleById(id){
    return service({
        url:`/oa/role/${id}`,
        method:'get'
    })
}

export async function saveRole(role){
    const data={
        ...role
    }

    return service({
        url:'/oa/role/addRole',
        method:'post',
        data: data
    })
}

/**
 *
 * @param role 需要更新的数据
 * @param id    根据id更新
 * @returns {Promise<*>}
 */
export async function updateRole(role,id){
    //根据所属部门名称查询所属部门的id
    const data={
        id,
        ...role
    }

    return service({
        url:'/oa/role/updateRole',
        method:'put',
        data: data
    })
}

export function getRoleByName(name){
    return service({
        url:`/oa/role/getOne/${name}`,
        method:'get'
    })
}
