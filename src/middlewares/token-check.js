/**
 * 中间件：检测token是否过期或者无效
 */
const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");
const {Forbidden} = require("../middlewares/response-handle-error")

class TokenCheck {

    static AUSE = 8
    static ADMIN = 16
    static SPUSER_ADMIN = 32

    constructor() {

    }

     getCheckMiddleWare() {
        return async (ctx, next) => {

            if(ctx.url.indexOf("user/login")) {
                // 如果是登录页面，不进行token验证
                await next();
                return;
            }

            // HTTP规定 身份验证机制 HttpBasicAuth

            // ctx.req: node.js原生数据
            // ctx.request：koa封装的对象
            const userToken = basicAuth(ctx.req); // basicAuth自动校验
            console.log("拿到的token", userToken);
            if (!userToken || !userToken.name) {
                // 中断next()的执行
                throw new Forbidden();
            }

            try {
                jwt.verify(userToken.name, global.config.security.secretKey);
                await next();
            } catch (error) {
                // 1. token不合法
                // 2. token过期
                if (error.name === "TokenExpiredError") {
                    throw new Forbidden("token已经过期");
                } else {
                    throw new Forbidden();
                }
            }
        };
    }
}

module.exports = TokenCheck;
