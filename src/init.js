const Router = require("koa-router");
const requireDirectory = require("require-directory");
const Menu = require("./models/menu");
const initMenuArray = require("./api/init_menu.js");

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
        InitManager.initClientMenus();
    }

    /**
     * 自动读取文件夹，自动适配路由
     */
    static loadRouters() {
        // try {
        function whenLoadModule(obj) {
            // 判断加载的是否是路由
            if (obj instanceof Router) {
                console.log(obj);
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
    static async initClientMenus() {
        // 数据库操作

        const initArray = await Menu.findAll();
        if(initArray.length > 0) {
            return;
        }

        const menuTypeEnum = ["menu", "subMenu", "button"];

        async function addChildren(id, menus, menuTypeLevel) {
            for (const menu of menus) {
                const menuType = menuTypeEnum[menuTypeLevel];
                const item = {
                    menuName: menu.name,
                    parentId: id,
                    orderNum: 1,
                    path: menu.path,
                    component: menu.component,
                    menuType: menuType,
                    visible: menu.hidden,
                    status: menu.status,
                    isIframe: menu.isIframe,
                };
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
            const item = {
                menuName: menu.name,
                parentId: null,
                orderNum: 1,
                path: menu.path.startsWith("/") ? menu.path : "/" + menu.path,
                component: menu.component,
                menuType: "menu",
                visible: menu.hidden,
                status: menu.status,
                isIframe: menu.isIframe,
            };

            const res = await Menu.create(item);
            const id = res.get("menuId");
            if (menu.children) {
                addChildren(id, menu.children, 1);
            }
        }
    }
}

module.exports = InitManager;
