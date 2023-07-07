/**
 * 全局的异常处理，包括各种错误的状态码
 */


class HttpException extends Error {
    constructor(message, errorCode, code) {
        super();
        this.message = message || "服务器异常";
        this.code = code || 500;
        this.errorCode = errorCode || 10000;
    }

    getData() {
        // status:
        // message:
        // code:
        // path:
        // method:
        return {
            code: this.code,
            message: this.message,
            errorCode: this.errorCode
        }
    }
}

class ParameterException extends HttpException {
    constructor(message, errorCode) {
        super();
        this.code = 400;
        this.message = message || "参数错误";
        this.errorCode = errorCode || 10000;
    }
}

class NotFoundException extends HttpException {
    constructor(message, errorCode) {
        super();
        this.code = 404;
        this.message = message || "资源未找到";
        this.errorCode = errorCode || 10000;
    }
}

class AuthFailedException extends HttpException {
    constructor(message, errorCode) {
        super();
        this.code = 401;
        this.message = message || "授权失败";
        this.errorCode = errorCode || 10004;
    }
}

class ForbiddenException extends HttpException {
    constructor(message, errorCode) {
        super();
        this.code = 403;
        this.message = message || "禁止访问";
        this.errorCode = errorCode || 10006;
    }
}

class Success extends HttpException {
    constructor(message, errorCode) {
        super();
        this.code = 201;
        this.message = message || "成功";
        this.errorCode = errorCode || 0;
    }
}


module.exports = {
    ParameterException,
    NotFoundException,
    AuthFailedException,
    ForbiddenException,
    Success,
    HttpException
}
