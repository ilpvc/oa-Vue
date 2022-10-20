import service from "@/utils/request";

export function login(username,password){
    const data={
        userAccount:username,
        userPwd:password
    }
    return service({
        url:"/login/",
        method:'post',
        data: data
    })
}
