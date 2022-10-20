import service from "@/utils/request";
import store from "@/store";
import moment from "moment";

/**
 * 查询所有的员工
 * @returns {*}
 */
export function allStudent(){
    return service({
        url:'/oa/student/allStudent',
        method: 'get',
    })
}

/**
 *  分页查询
 * @param pageNo 当前页
 * @param pageCount 每页数量
 * @returns {*}
 */
export function pageStudent(pageNo,pageCount){
    return service({
        url:`/oa/student/pageStudent/${pageNo}/${pageCount}`,
        method:'get'
    })
}

export function delStudent(id){
    return service({
        url:`/oa/student/${id}`,
        method:'delete'
    })
}

export async function saveStudent(student){
    const {allClassNoAndNameMap} = store.state.classStore;
    let classId
    for (const [key,value] of allClassNoAndNameMap) {
        if (value===student.stuClassId){
            classId = key
            break
        }
    }
    let time = moment(student.stuEntryTime).format("YYYY-MM-DDTHH:mm:ss.SSS")

    const data={
        ...student,
        stuClassId:classId,
        stuEntryTime:time
    }
    return service({
        url:'/oa/student/addStudent',
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
export async function updateStudent(student,id){
    const {allClassNoAndNameMap} = store.state.classStore;
    let classId
    for (const [key,value] of allClassNoAndNameMap) {
        if (value===student.stuClassId){
            classId = key
            break
        }
    }
    let time = moment(student.stuEntryTime).format("YYYY-MM-DDTHH:mm:ss.SSS")

    const data={
        id,
        ...student,
        stuClassId:classId,
        stuEntryTime:time
    }
    return service({
        url:'/oa/student/updateStudent',
        method:'put',
        data: data
    })
}


export function getStudentByClassId(id){
    return service({
        url:`/oa/student/getByClassId/${id}`,
        method:'get'
    })
}

export function getStudentById(id){
    return service({
        url:`/oa/student/${id}`,
        method:'get'
    })
}