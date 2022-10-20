import service from "@/utils/request";

/**
 * 查询所有的员工
 * @returns {*}
 */
export function allMenu(){
    return service({
        url:'/oa/menu/allMenu',
        method: 'get',
    })
}

/**
 *  分页查询
 * @param pageNo 当前页
 * @param pageCount 每页数量
 * @returns {*}
 */
export function pageMenu(pageNo,pageCount){
    return service({
        url:`/oa/menu/pageMenu/${pageNo}/${pageCount}`,
        method:'get'
    })
}

export function delMenu(id){
    return service({
        url:`/oa/menu/${id}`,
        method:'delete'
    })
}

export async function saveMenu(menu){
    // let res = await getDeptByName(menu.belongDept)
    // menu.empDeptId = res.data.item.deptId
    const data={
        ...menu
    }

    return service({
        url:'/oa/menu/addMenu',
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
export async function updateMenu(menu,id){
    //根据所属部门名称查询所属部门的id
    // let res = await getDeptByName(menu.belongDept)
    // menu.empDeptId = res.data.item.deptId
    const data={
        id,
        ...menu
    }

    return service({
        url:'/oa/menu/updateMenu',
        method:'put',
        data: data
    })
}


export function getMenuById(id){
    return service({
        url:`/oa/menu/${id}`,
        method:'get'
    })
}

export function getMenuByParentId(id){
    return service({
        url: `/oa/menu/byParentId/${id}`,
        method: 'get'
    })
}