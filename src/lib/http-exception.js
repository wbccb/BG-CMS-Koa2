/**
 * 全局的异常处理，包括各种错误的状态码
 */


class HttpException extends Error {
    constructor(msg, errorCode, code) {
        super();
        this.msg = msg || "服务器异常";
        this.code = code || 400;
        this.errorCode = errorCode || 10000;
    }
}

class ParameterException extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 400;
        this.msg = msg || "参数错误";
        this.errorCode = errorCode || 10000;
    }
}

class NotFoundException extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 404;
        this.msg = msg || "资源未找到";
        this.errorCode = errorCode || 10000;
    }
}

class AuthFailedException extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 401;
        this.msg = msg || "授权失败";
        this.errorCode = errorCode || 10004;
    }
}

class ForbiddenException extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 403;
        this.msg = msg || "禁止访问";
        this.errorCode = errorCode || 10006;
    }
}

class Success extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 201;
        this.msg = msg || "成功";
        this.errorCode = errorCode || 0;
    }
}


module.exports = {
    ParameterException,
    NotFoundException,
    AuthFailedException,
    ForbiddenException,
    Success
}
