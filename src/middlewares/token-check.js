/**
 * 中间件：检测token是否过期或者无效
 */
const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");

class TokenCheck {

    static AUSE = 8
    static ADMIN = 16
    static SPUSER_ADMIN = 32

    constructor() {

    }

    get m() {
        return async (ctx, next) => {
            // HTTP规定 身份验证机制 HttpBasicAuth

            // ctx.req: node.js原生数据
            // ctx.request：koa封装的对象
            const userToken = basicAuth(ctx.req); // basicAuth自动校验
            if (!userToken || !userToken.name) {
                throw new global.errs.Forbidden();
            }

            try {
                jwt.verify(userToken.name, global.config.security.secretKey);
            } catch (e) {
                // 1. token不合法
                // 2. token过期
                if (error.name === "TokenExpiredError") {
                    throw new global.errs.Forbidden("token已经过期");
                }
            }
        };
    }
}

module.exports = TokenCheck;
