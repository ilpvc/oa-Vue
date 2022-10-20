import service from "@/utils/request";
import {getRoleByName} from "@/api/role/role";

//查询所有的部门
export function allPermission(){
    return service({
        url:'/oa/permissions/allPermissions',
        method: 'get'
    })
}

//分页查询部门
export function pagePermission(pageNo,pageCount){

    return service({
        url:`/oa/permissions/pagePermissions/${pageNo}/${pageCount}`,
        method:'get'
    })

}

//根据id删除部门的api请求
export function deletePermission(id){
    return service({
        url:`/oa/permissions/${id}`,
        method: 'delete'
    })
}

export function getPermissionById(id){
    return service({
        url:`/oa/permissions/${id}`,
        method:'get'
    })
}

export async function savePermission(permission){

    const data=[]
    let role = await getRoleByName(permission.permissionsRole)
    let roleId = role.data.item.roleId

    for (const roleIdElement of permission.permissionsMenu) {
        let permissionItem={
            permissionsRoleId:roleId,
            permissionsMenuId:roleIdElement
        }
        data.push(permissionItem)
    }

    return service({
        url:'/oa/permissions/addPermissions',
        method:'post',
        data: data
    })
}

/**
 *
 * @param permission 需要更新的数据
 * @param id    根据id更新
 * @returns {Promise<*>}
 */
export async function updatePermission(permission,id){
    //根据所属部门名称查询所属部门的id
    const data={
        id,
        ...permission
    }

    return service({
        url:'/oa/permissions/updatePermissions',
        method:'put',
        data: data
    })
}

export function getPermissionByRoleId(id){
    return service({
        url:`/oa/permissions/getByRoleId/${id}`,
        method:'get'
    })
}
