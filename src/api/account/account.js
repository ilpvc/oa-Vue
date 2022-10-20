import service from "@/utils/request";
import {getRoleByName} from "@/api/role/role";
import store from "@/store";

//查询所有的部门
export function allUser(){
    return service({
        url:'/oa/user/allUser',
        method: 'get'
    })
}

//分页查询部门
export function pageUser(pageNo,pageCount){

    return service({
        url:`/oa/user/pageUser/${pageNo}/${pageCount}`,
        method:'get'
    })

}

//根据id删除部门的api请求
export function deleteUser(id){
    return service({
        url:`/oa/user/${id}`,
        method: 'delete'
    })
}

export function getUserById(id){
    return service({
        url:`/oa/user/${id}`,
        method:'get'
    })
}

export async function saveUser(user){

    let res =await getRoleByName(user.userRole)
    user.userRoleId = res.data.item.roleId
    let userKey = null
    for (const [key,value] of store.state.userStore.statusInfo) {
        if (user.userStatus ===value) {
            userKey=key
            break
        }
    }
    let userEmpNo=null
    if (user.userEmpNo!==null){
        userEmpNo=user.userEmpNo.split(" ")[0]
    }
    const data={
        ...user,
        userStatus:userKey,
        userEmpNo
    }

    return service({
        url:'/oa/user/addUser',
        method:'post',
        data: data
    })
}

/**
 *
 * @param user 需要更新的数据
 * @param id    根据id更新
 * @returns {Promise<*>}
 */
export async function updateUser(user,id){

    let res =await getRoleByName(user.userRole)
    user.userRoleId = res.data.item.roleId
    let userKey = null
    for (const [key,value] of store.state.userStore.statusInfo) {
        if (user.userStatus ===value) {
            userKey=key
            break
        }
    }
    let userEmpNo=null
    if (user.userEmpNo!==null){
        userEmpNo=user.userEmpNo.split(" ")[0]
    }
    //根据所属部门名称查询所属部门的id
    const data={
        id,
        ...user,
        userStatus:userKey,
        userEmpNo
    }

    return service({
        url:'/oa/user/updateUser',
        method:'put',
        data: data
    })
}

export function getUserByName(name){
    console.log(name)
    return service({
        url:`/oa/user/getUserByName`,
        method:'post',
        data: name
    })
}

export function resetUserPassword({userId,userName,oldPassword,newPassword}){

    let data ={
        userId,
        userName,
        oldPassword,
        newPassword
    }

    return service({
        url:`/oa/user/resetPassword`,
        method: 'post',
        data: data
    })

}
