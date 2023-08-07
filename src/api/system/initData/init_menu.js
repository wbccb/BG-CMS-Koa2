module.exports = [
    {
        name: "System", // 路由的名称，唯一性，可以在跳转时使用
        path: "/system", // 路由的具体路径，唯一性，可以在跳转时使用
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: {
            title: "系统管理",
            icon: "system",
            noCache: false,
            link: null,
            hidden: false,
            status: true,
            menuType: "menu"
        },
        children: [
            {
                name: "User",
                path: "user",
                component: "system/user/index",
                meta: {
                    title: "用户管理",
                    icon: "user",
                    noCache: false,
                    link: null,
                    hidden: false,
                    status: true,
                    menuType: "button"
                },
            },
            {
                name: "Role",
                path: "role",
                component: "system/role/index",
                meta: {
                    title: "角色管理",
                    icon: "peoples",
                    noCache: false,
                    link: null,
                    hidden: false,
                    status: true,
                    menuType: "button"
                },
            },
            {
                name: "Menu",
                path: "menu",
                component: "system/menu/index",
                meta: {
                    title: "菜单管理",
                    icon: "tree-table",
                    noCache: false,
                    link: null,
                    hidden: false,
                    status: true,
                    menuType: "button"
                },
            },
        ],
    },
    {
        name: "wbccb官网",
        path: "https://github.com/wbccb",
        component: "Layout",
        meta: {
            title: "wbccb官网",
            icon: "guide",
            noCache: false,
            link: "https://github.com/wbccb",
            hidden: false,
            status: true,
            menuType: "button"
        },
    },
];
