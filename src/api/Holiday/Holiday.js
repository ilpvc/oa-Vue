import service from "@/utils/request";
import {getConfigByName} from "@/api/configType/configType";
import store from "@/store";
import moment from "moment";

/**
 * 查询所有的员工
 * @returns {*}
 */
export function allHoliday() {
    return service({
        url: '/oa/holiday/allHoliday',
        method: 'get',
    })
}

/**
 *  分页查询
 * @param pageNo 当前页
 * @param pageCount 每页数量
 * @returns {*}
 */
export function pageHoliday(pageNo, pageCount) {
    return service({
        url: `/oa/holiday/pageHoliday/${pageNo}/${pageCount}`,
        method: 'get'
    })
}
//删除请假记录
export function delHoliday(id) {
    return service({
        url: `/oa/holiday/${id}`,
        method: 'delete'
    })
}


//添加请假记录
export async function saveHoliday(holiday) {

    let res = await getConfigByName(holiday.holidayTypeId)
    let status = store.state.reimburseStore.reimburseStatus
    let statusKey = null
    let allEmployeeData = store.state.empStore.allEmployeeData
    for (const [key, value] of status) {
        if (value === holiday.holidayStatus) {
            statusKey = key
            break
        }
    }
    let k = holiday.holidayUserNo.split(" ")
    for (const [key, value] of allEmployeeData) {
        if (value.empNo === k[0]) {
            k[1] = key
        }
    }
    let startTime = moment(holiday.holidayTime[0]).format("YYYY-MM-DDTHH:mm:ss.SSS")
    let endTime = moment(holiday.holidayTime[1]).format("YYYY-MM-DDTHH:mm:ss.SSS")

    const data = {
        ...holiday,
        holidayStatus: statusKey,
        holidayTypeId: res.data.item.configId,
        holidayUserNo: k[1],
        holidayStartTime: startTime,
        holidayEndTime: endTime
    }

    return service({
        url:'/oa/holiday/addHoliday',
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
export async function updateHoliday(holiday, id) {

    let res = await getConfigByName(holiday.holidayTypeId)
    let status = store.state.reimburseStore.reimburseStatus
    let statusKey = null
    let allEmployeeData = store.state.empStore.allEmployeeData
    for (const [key, value] of status) {
        if (value === holiday.holidayStatus) {
            statusKey = key
            break
        }
    }
    let k = holiday.holidayUserNo.split(" ")
    for (const [key, value] of allEmployeeData) {
        if (value.empNo === k[0]) {
            k[1] = key
        }
    }
    let startTime = moment(holiday.holidayTime[0]).format("YYYY-MM-DDTHH:mm:ss.SSS")
    let endTime = moment(holiday.holidayTime[1]).format("YYYY-MM-DDTHH:mm:ss.SSS")

    const data = {
        id,
        ...holiday,
        holidayStatus: statusKey,
        holidayTypeId: res.data.item.configId,
        holidayUserNo: k[1],
        holidayStartTime: startTime,
        holidayEndTime: endTime
    }

    return service({
        url: '/oa/holiday/updateHoliday',
        method: 'put',
        data: data
    })
}


export function getHolidayById(id) {
    return service({
        url: `/oa/holiday/${id}`,
        method: 'get'
    })

}

export function getHolidayByCondition(pageNo, pageCount, condition) {
    return service({
        url: `/oa/holiday/pageConfigCondition/${pageNo}/${pageCount}`,
        method: 'post',
        data: condition
    })
}

export async function updateHolidaySimple(holiday, id){
    let data={
        id,
        ...holiday
    }
    console.log(data)
    return service({
        url: '/oa/holiday/updateHoliday',
        method: 'put',
        data: data
    })
}