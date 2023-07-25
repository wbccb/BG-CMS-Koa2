const Router = require("koa-router");
const requireDirectory = require("require-directory");

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
}

module.exports = InitManager;
