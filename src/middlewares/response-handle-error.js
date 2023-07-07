const {
    ParameterException,
    NotFoundException,
    AuthFailedException,
    ForbiddenException,
    Success,
    HttpException,
} = require("../lib/http-exception");

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

        debugger;
        if (isHttpException) {
            // status可以告诉浏览器返回值的类型
            ctx.status = e.code;
            // 浏览器解析的是这个res.data，也就是body的值
            ctx.body = {
                code: e.code,
                message: e.message,
                data: e.data || {}
            }
        } else {
            ctx.body = {
                code: 500,
                message: "未知错误！",
                request: `${ctx.method} ${ctx.path}`,
                test: false
            };
            ctx.status = 500;
        }

        // 生产环境，返回错误码以及原因
    }
};

module.exports = catchError;
