import service from "@/utils/request";
import {getDeptByName} from "@/api/dept/dept";

/**
 * 查询所有的员工
 * @returns {*}
 */
export function allEmployee(){
    return service({
        url:'/oa/employee/allEmployee',
        method: 'get',
    })
}

/**
 *  分页查询
 * @param pageNo 当前页
 * @param pageCount 每页数量
 * @returns {*}
 */
export function pageEmployee(pageNo,pageCount){
    return service({
        url:`/oa/employee/pageEmployee/${pageNo}/${pageCount}`,
        method:'get'
    })
}

export function delEmployee(id){
    return service({
        url:`/oa/employee/${id}`,
        method:'delete'
    })
}

export async function saveEmployee(employee){
    let res = await getDeptByName(employee.belongDept)
    employee.empDeptId = res.data.item.deptId
    const data={
        ...employee
    }

    return service({
        url:'/oa/employee/addEmployee',
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
export async function updateEmployee(employee,id){
    //根据所属部门名称查询所属部门的id
    let res = await getDeptByName(employee.belongDept)
    employee.empDeptId = res.data.item.deptId
    const data={
        id,
        ...employee
    }

    return service({
        url:'/oa/employee/updateEmployee',
        method:'put',
        data: data
    })
}


export function getEmployeeById(id){
    return service({
        url:`/oa/employee/${id}`,
        method:'get'
    })
}

export function getPageEmployeeByCondition(pageNo,pageCount,{empEducation,empSex,empDeptId}){

    const data = {
        empEducation,
        empSex,
        empDeptId
    }

    return service({
        url:`/oa/employee/pageConfigCondition/${pageNo}/${pageCount}`,
        method: 'post',
        data: data
    })
}

export function getEmployeeByCondition({empEducation,empSex,empDeptId}){

    const data = {
        empEducation,
        empSex,
        empDeptId
    }

    return service({
        url:`/oa/employee/empCondition/`,
        method: 'post',
        data: data
    })
}