module.exports = [
    {
        name: "System",
        path: "/system",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: {
            title: "系统管理",
            icon: "system",
            noCache: false,
            link: null,
        },
        children: [
            {
                name: "User",
                path: "user",
                hidden: false,
                component: "system/user/index",
                meta: {
                    title: "用户管理",
                    icon: "user",
                    noCache: false,
                    link: null,
                },
            },
            {
                name: "Role",
                path: "role",
                hidden: false,
                component: "system/role/index",
                meta: {
                    title: "角色管理",
                    icon: "peoples",
                    noCache: false,
                    link: null,
                },
            },
            {
                name: "Menu",
                path: "menu",
                hidden: false,
                component: "system/menu/index",
                meta: {
                    title: "菜单管理",
                    icon: "tree-table",
                    noCache: false,
                    link: null,
                },
            },
        ],
    },
    {
        name: "wbccb官网",
        path: "https://github.com/wbccb",
        hidden: false,
        component: "Layout",
        meta: {
            title: "wbccb官网",
            icon: "guide",
            noCache: false,
            link: "https://github.com/wbccb",
        },
    },
];
