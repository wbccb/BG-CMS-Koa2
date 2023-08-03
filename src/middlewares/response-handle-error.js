const {
    ParameterException,
    NotFoundException,
    AuthFailedException,
    ForbiddenException,
    Success,
    HttpException,
    HTTP_CODE,
} = require("../lib/http-response");

/**
 * 放在app.use()第一个中间件，可以捕获所有的await next()错误
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const catchError = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        // 开发环境，直接throw


        const isHttpException = e instanceof HttpException;
        const isDev = global.config.environment === "dev";
        console.error("全局catchError", JSON.stringify(e));
        // if (isDev && !isHttpException) {
        //     throw e;
        // }

        // {
        //     "code": 200,
        //     "message": "OK",
        //     "data": {
        //
        // }

        if (isHttpException) {
            // status可以告诉浏览器返回值的类型
            ctx.status = e.httpCode;
            // 浏览器解析的是这个res.data，也就是body的值
            const responseData = {
                code: e.code,
                desc: e.desc,
                data: e.data || {},
            };
            if (e.errorKey) {
                responseData.data = {
                    errorKey: e.errorKey,
                };
            }
            ctx.body = responseData;
        } else {
            if (e.message === "Authentication Error") {
                // koa-jwt throw出来的错误，因此只能手动判断了
                ctx.body = {
                    code: HTTP_CODE["TOKEN验证失败，请重新登录"],
                    message: "授权验证失败",
                };
                ctx.status = 200;
            } else {
                ctx.body = {
                    code: 500,
                    message: "未知错误！",
                    request: `${ctx.method} ${ctx.path}`,
                };
                ctx.status = 500;
            }
        }

        // 生产环境，返回错误码以及原因
    }
};

module.exports = catchError;
