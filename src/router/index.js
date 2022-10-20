import {createRouter, createWebHashHistory} from "vue-router/dist/vue-router";
import {getToken} from "@/utils/auth";
import {useMessage} from "naive-ui"

const message = useMessage()

export const constantRoutes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home/MyHome'),
        meta: {
            isAuth: true
        },
        children: [
            {
                path: 'welcome',
                name: 'welcome',
                component: () => import('@/views/Welcome/WelcomePage')
            },
            {
                path: 'people',
                name: 'people',
                children: [
                    {
                        path: 'dept',
                        name: 'dept',
                        children: [
                            {
                                path: 'allDept',
                                name: 'allDept',
                                component: () => import('@/views/Dept/AllDept'),
                            },
                            {
                                path: 'addDept',
                                name: 'addDept',
                                component: () => import('@/views/Dept/AddDept'),
                            },
                            {
                                path: 'updateDept/:id',
                                name: 'updateDept',
                                component: () => import('@/views/Dept/AddDept'),
                            }
                        ]
                    },
                    {
                        path: 'employee',
                        name: 'employee',
                        children: [
                            {
                                path: 'allEmployee',
                                name: 'allEmployee',
                                component: () => import("@/views/Employee/allEmployee")
                            },
                            {
                                path: 'addEmployee',
                                name: 'addEmployee',
                                component: () => import("@/views/Employee/addEmployee")
                            },
                            {
                                path: 'updateEmployee/:id',
                                name: 'updateEmployee',
                                component: () => import("@/views/Employee/addEmployee")
                            }
                        ]
                    },
                    {
                        path: 'holiday',
                        name: 'holiday',
                        children: [
                            {
                                path: 'allHoliday',
                                name: 'allHoliday',
                                component: () => import('@/views/Holiday/AllHoliday')
                            },
                            {
                                path: 'addHoliday',
                                name: 'addHoliday',
                                component: () => import('@/views/Holiday/AddHoliday')
                            },
                            {
                                path: 'updateHoliday/:id',
                                name: 'updateHoliday',
                                component: () => import('@/views/Holiday/AddHoliday')
                            },
                            {
                                path: 'replyHoliday',
                                name: 'replyHoliday',
                                component: () => import('@/views/Holiday/ReplyHoliday')
                            }
                        ]
                    },
                    {
                        path: 'class',
                        name: 'class',
                        children: [
                            {
                                path: 'allClass',
                                name: 'allClass',
                                component: () => import('@/views/Class/AllClass')
                            },
                            {
                                path: 'addClass',
                                name: 'addClass',
                                component: () => import('@/views/Class/AddClass')
                            },
                            {
                                path: 'updateClass/:id',
                                name: 'updateClass',
                                component: () => import('@/views/Class/AddClass')
                            }
                        ]
                    },
                    {
                        path: 'student',
                        name: 'student',
                        children: [
                            {
                                path: 'allStudent',
                                name: 'allStudent',
                                component: () => import('@/views/Student/AllStudent')
                            },
                            {
                                path: 'addStudent',
                                name: 'addStudent',
                                component: () => import('@/views/Student/AddStudent')
                            },
                            {
                                path: 'updateStudent/:id',
                                name: 'updateStudent',
                                component: () => import('@/views/Student/AddStudent')
                            }
                        ]
                    }

                ]
            },
            {
                path: "financial",
                name: 'financial',
                children: [
                    {
                        path: "allReimburse",
                        name: 'allReimburse',
                        component:()=>import('@/views/Reimburse/AllReimburse')
                    },
                    {
                        path: "addReimburse",
                        name: 'addReimburse',
                        component:()=>import('@/views/Reimburse/AddReimburse')
                    },
                    {
                        path: "updateReimburse/:id",
                        name: 'updateReimburse',
                        component:()=>import('@/views/Reimburse/AddReimburse')
                    },
                    {
                        path: "replyReimburse",
                        name: 'replyReimburse',
                        component:()=>import('@/views/Reimburse/ReplyReimburse')
                    }
                ]
            },
            {
                path: 'setting',
                name: 'setting',
                children: [
                    {
                        path: 'account',
                        name: 'account',
                        children: [
                            {
                                path: 'allAccount',
                                name: 'allAccount',
                                component: () => import('@/views/Account/AllAccount')
                            },
                            {
                                path: 'addAccount',
                                name: 'addAccount',
                                component: () => import('@/views/Account/AddAccount')
                            },
                            {
                                path: 'updateAccount/:id',
                                name: 'updateAccount',
                                component: () => import('@/views/Account/AddAccount')
                            }

                        ]
                    },
                    {
                        path: 'role',
                        name: 'role',
                        children: [
                            {
                                path: 'allRole',
                                name: 'allRole',
                                component:()=>import('@/views/Role/AllRole')
                            },
                            {
                                path: 'addRole',
                                name: 'addRole',
                                component:()=>import('@/views/Role/AddRole')
                            },
                            {
                                path: 'updateRole/:id',
                                name: 'updateRole',
                                component:()=>import('@/views/Role/AddRole')
                            }
                        ]
                    },
                    {
                        path: 'permission',
                        name: 'permission',
                        children: [
                            {
                                path: 'allPermission',
                                name: 'allPermission',
                                component:()=>import('@/views/Permission/AllPermission')
                            },
                            {
                                path: 'addPermission',
                                name: 'addPermission',
                                component:()=>import('@/views/Permission/AddPermission')
                            },
                            {
                                path: 'updatePermission/:id',
                                name: 'updatePermission',
                                component:()=>import('@/views/Permission/AddPermission')
                            }
                        ]
                    },
                    {
                        path: 'passwordReset',
                        name: 'passwordReset',
                        component: () => import('@/views/PasswordReset/PasswordReset')
                    }

                ]
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login/LoginIndex')
    },

]

const router = createRouter({
    routes: constantRoutes,
    history: createWebHashHistory(),
})

router.beforeEach((to, from, next) => {
    if (to.meta.isAuth) {
        if (getToken() !== undefined) {
            next();
        } else {
            alert("你还没有登录或者登录信息过期，请重新登录")
            router.push({
                path: '/login',
            })
        }
    } else {
        next()
    }
})

export default router