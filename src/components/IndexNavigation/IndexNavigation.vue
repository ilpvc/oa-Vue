<template>
  <n-layout-sider
      :native-scrollbar="false"
      bordered
      collapse-mode="trans"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false">
    <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        key-field="key"
        label-field="label"
        children-field="whateverChildren"
        :default-value="'welcome'"/>
  </n-layout-sider>
</template>

<script setup>
import {h, onMounted, ref} from "vue";
import {RouterLink, useRouter} from "vue-router"
import {useMessage, useDialog, NIcon} from "naive-ui";
import {
  PersonOutline as PersonIcon,
  SettingsOutline as Setting,
  CardOutline as Card,
  HomeOutline as Home
} from "@vicons/ionicons5";
import {removeToken} from "@/utils/auth";
import {useStore} from "vuex";
import {getPermissionByRoleId} from "@/api/permission/permission";

const store = useStore()
const router = useRouter()
const dialog = useDialog()
const message = useMessage()

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)});
}

const menuOptions = [
  {
    label: () => h(
        RouterLink,
        {
          to: {
            name: 'welcome'
          }
        },
        {default: () => "首页"}
    ),
    key: "welcome",
    icon: renderIcon(Home)
  },
  {
    label: "人事管理",
    key: "people",
    icon: renderIcon(PersonIcon),
    whateverChildren: [
      {
        label: "部门管理",
        key: "modules",
        whateverChildren: [
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    path: '/people/dept/allDept'
                  }
                },
                {default: () => "所有部门"}
            ),
            key: "allDept",
          },
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    path: '/people/dept/addDept'
                  }
                },
                {default: () => "新增部门"}
            ),
            key: "addDept"
          },
        ]
      },
      {
        label: "员工管理",
        key: "employee",
        whateverChildren: [
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'allEmployee'
                  }
                },
                {default: () => "所有员工"}
            ),
            key: "allEmployee",
          },
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'addEmployee'
                  }
                },
                {default: () => "新增员工"}
            ),
            key: "addEmployee",
          }
        ]

      },
      {
        label: "请假管理",
        key: "holiday",
        whateverChildren: [
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'allHoliday'
                  }
                },
                {default: () => "请假列表"}
            ),
            key: "allHoliday"
          },
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'addHoliday'
                  }
                },
                {default: () => "新增请假"}
            ),
            key: "addHoliday"
          },
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'replyHoliday'
                  }
                },
                {default: () => "批复请假"}
            ),
            key: "replyHoliday"
          },
        ]
      },
      {
        label: "班级管理",
        key: "class",
        whateverChildren: [
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'allClass'
                  }
                },
                {default: () => "所有班级"}
            ),
            key: "allClass"
          },
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'addClass'
                  }
                },
                {default: () => "新增班级"}
            ),
            key: "addClass"
          },
        ]
      },
      {
        label: "学生管理",
        key: "student",
        whateverChildren: [
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'allStudent'
                  }
                },
                {default: () => "所有学生"}
            ),
            key: "allStudent"
          },
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'addStudent'
                  }
                },
                {default: () => "新增学生"}
            ),
            key: "addStudent"
          },
        ]
      }
    ]
  },
  {
    label: "财务管理",
    key: "pinball-1973",
    icon: renderIcon(Card),
    whateverChildren: [
      {
        label: "报销管理",
        key: "reimburse",
        whateverChildren: [
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'allReimburse'
                  }
                },
                {default: () => "获得报销"}
            ),
            key: 'allReimburse'
          },
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'addReimburse'
                  }
                },
                {default: () => "添加报销"}
            ),
            key: 'addReimburse'
          },
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'replyReimburse'
                  }
                },
                {default: () => "批复报销"}
            ),
            key: 'replyReimburse'
          }
        ]
      }
    ]
  },
  {
    label: "系统管理",
    key: "setting",
    icon: renderIcon(Setting),
    whateverChildren: [
      {
        label: "账户维护",
        key: "AccountMaintenance",
        whateverChildren: [
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'allAccount'
                  }
                },
                {default: () => "所有账户"}
            ),
            key: 'allAccount'
          },
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'addAccount'
                  }
                },
                {default: () => "添加账户"}
            ),
            key: 'addAccount'
          }
        ]
      },
      {
        label: "角色管理",
        key: "role",
        whateverChildren: [
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'allRole'
                  }
                },
                {default: () => "所有角色"}
            ),
            key: 'allRole'
          },
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'addRole'
                  }
                },
                {default: () => "添加角色"}
            ),
            key: 'addRole'
          },
        ]
      },
      {
        label: "权限管理",
        key: 'permission',
        whateverChildren: [
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'allPermission'
                  }
                },
                {default: () => "所有权限记录"}
            ),
            key: 'allPermission'
          },
          {
            label: () => h(
                RouterLink,
                {
                  to: {
                    name: 'addPermission'
                  }
                },
                {default: () => "添加权限"}
            ),
            key: 'addPermission'
          },
        ]
      },
      {
        label: () => h(
            RouterLink,
            {
              to: {
                name: 'passwordReset'
              }
            },
            {default: () => "密码重置"}
        ),
        key: "passwordReset"
      },
      {
        label: () => h(
            "a",
            {
              onClick: () => {
                dialog.warning({
                  title: "警告",
                  content: "确认退出系统",
                  positiveText: "确定",
                  negativeText: "取消",
                  onPositiveClick: () => {
                    message.success("退出成功");
                    removeToken()
                    store.dispatch("userStore/removeLoginUser")
                    router.push({name: 'login'})
                  },
                  onNegativeClick: () => {
                    message.error("取消");
                  }
                });
              }
            },
            {default: () => "退出系统"}
        ),
        key: 'exit',

      }
    ]
  },

];


async function init() {
  let roleId = sessionStorage.getItem("roleId")
  let res = await getPermissionByRoleId(roleId)
  let items = res.data.items
  let menu = store.state.menuStore.menu

  //全部菜单重置为false
  for (let i = 1; i <= 3; i++) {
    menuOptions[i].show = false
    for (let j = 0; j <= 4; j++) {
      if (menuOptions[i].whateverChildren[j] !== undefined) {
        menuOptions[i].whateverChildren[j].show = false
        for (let k = 0; k <= 2; k++) {
          if (menuOptions[i].whateverChildren[j].whateverChildren !== undefined &&
              menuOptions[i].whateverChildren[j].whateverChildren[k] !== undefined) {
            menuOptions[i].whateverChildren[j].whateverChildren[k].show = false
          }
        }
      }
    }
  }
  for (const item of items) {
    let menuLevel = menu.get(item.permissionsMenuId).menuLevel.split("-")
    let [one, two, three] = menuLevel
    for (let i = 1; i <= 3; i++) {
      //如果等于当前等级
      if (i === parseInt(one)) {
        menuOptions[i].show = true
        for (let j = 0; j <= 4; j++) {
          if (menuOptions[i].whateverChildren[j] !== undefined) {
            if (two === undefined ||j === parseInt(two)) {
              menuOptions[i].whateverChildren[j].show = true
              for (let k = 0; k <= 2; k++) {
                if (menuOptions[i].whateverChildren[j].whateverChildren !== undefined &&
                    menuOptions[i].whateverChildren[j].whateverChildren[k] !== undefined)
                  if (three === undefined || k === parseInt(three)) {
                    menuOptions[i].whateverChildren[j].whateverChildren[k].show = true
                  }
              }
            }

          }
        }
      }
    }
    menuOptions[3].whateverChildren[4].show = true
  }
}

let collapsed = ref(false)

onMounted(() => {
  init()
})
</script>