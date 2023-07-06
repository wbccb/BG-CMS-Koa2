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

        global.err


        // 生产环境，返回错误码以及原因
    }
};

module.exports = catchError;
