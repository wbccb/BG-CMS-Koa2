const Router = require("koa-router");
const requireDirectory = require("require-directory");
const Menu = require("./models/menu");
const Role = require("./models/role");
const People = require("./models/people");
const initMenuArray = require("./api/system/initData/init_menu.js");
const initRoleArray = require("./api/system/initData/init_role.js");
const initPeopleArray = require("./api/system/initData/init_people.js");

class InitManager {
    /**
     * 初始化全局对象
     * @param app
     */
    static initCore(app) {
        InitManager.app = app;
        InitManager.loadRouters();
        InitManager.loadHttpException();
        InitManager.loadConfig();
        InitManager.initMenuData();
        InitManager.initRoleData();
        InitManager.initPeople();
    }

    /**
     * 自动读取文件夹，自动适配路由
     */
    static loadRouters() {
        // try {
        function whenLoadModule(obj) {
            // 判断加载的是否是路由
            if (obj instanceof Router) {
                // console.log(obj);
                InitManager.app.use(obj.routes());
            }
        }

        // TODO 生产环境如何区分？？
        const routerDir = `${process.cwd()}/src/api`;
        // 自动获取该目录下所有的module.exports，判断是否是路由
        requireDirectory(module, routerDir, {
            visit: whenLoadModule,
        });
        // } catch (e) {
        //     console.error(e);
        // }
    }

    /**
     * 全局配置文件加载
     */
    static loadConfig(path) {
        const configPath = path || `${process.cwd()}/src/config/config.js`;
        const config = require(configPath);
        global.config = config;
    }

    /**
     * 全局错误处理方法加载
     */
    static loadHttpException() {
        const errors = require("./lib/http-response");
        global.errs = errors;
    }

    /**
     * 初始化客户端菜单
     */
    static async initMenuData() {
        // 数据库操作

        function createMenuItem(id, menu, menuTypeLevel) {
            const menuType = menuTypeEnum[menuTypeLevel];
            const item = {
                menuName: menu.meta.title,
                parentId: id,
                orderNum: 1,
                name: menu.name,
                path: menu.path,
                component: menu.component,
                menuType: menuType,
                visible: menu.meta.hidden,
                status: menu.meta.status,
                isIframe: menu.isIframe,
            };
            return item;
        }

        const initArray = await Menu.findAll();
        if(initArray.length > 0) {
            return;
        }

        const menuTypeEnum = ["menu", "subMenu", "button"];

        async function addChildren(id, menus, menuTypeLevel) {
            for (const menu of menus) {
                const item = createMenuItem(id, menu, menuTypeLevel);
                const res = await Menu.create(item);
                const subId = res.get("id");
                if (menu.children) {
                    addChildren(subId, menu.children, menuTypeLevel + 1);
                }
            }
        }

        // 从数据中拆分出每一项menu
        for (const menu of initMenuArray) {
            //  menuType: "subMenu" | "menu" | "button";
            // 插入menu到数据库中，获取对应的id，提供给children进行parentId的标记
            const item = createMenuItem(null, menu, 0);
            const res = await Menu.create(item);

            const id = res.get("menuId");
            if (menu.children) {
                addChildren(id, menu.children, 1);
            }
        }
    }


    static async initRoleData() {
        const initArray = await Role.findAll();
        if(initArray.length > 0) {
            return;
        }
        // 从数据中拆分出每一项menu
        for (const role of initRoleArray) {
            await Role.create(role);
        }

    }

    static async initPeople() {
        const initArray = await People.findAll();
        if(initArray.length > 0) {
            return;
        }
        // 从数据中拆分出每一项menu
        for (const people of initPeopleArray) {
            await People.create(people);
        }
    }

}

module.exports = InitManager;
