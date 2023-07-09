/**
 * 全局的异常处理，包括各种错误的状态码
 */


class HttpException extends Error {
    constructor(message, errorCode, code) {
        super();
        this.message = message || "服务器异常";
        this.code = code || 500;
        this.data = {};
    }

    getData() {
        // status:
        // message:
        // code:
        // path:
        // method:
        const obj = {
            code: this.code,
            message: this.message,
            data: this.data
        }
        if(this.errorKey) {
            obj.data.errorKey = this.errorKey;
        }
        return obj;
    }
}

class ParameterException extends HttpException {
    constructor(message, errorKey) {
        super();
        this.code = 400;
        this.message = message || "参数错误";
        this.errorKey = errorKey;
    }
}


class NotFoundException extends HttpException {
    constructor(code, message) {
        super();
        this.code = code || 404;
        this.message = message || "资源未找到";
    }
}

class AuthFailedException extends HttpException {
    constructor(message) {
        super();
        this.code = 401;
        this.message = message || "授权失败";
    }
}

class ForbiddenException extends HttpException {
    constructor(message) {
        super();
        this.code = 403;
        this.message = message || "禁止访问";
    }
}

class Success extends HttpException {
    constructor(message, data) {
        super();
        this.code = 201;
        this.message = message || "成功";
        this.data = data;
    }

    setData(data) {
        this.data = data;
    }
}

class OtherException extends HttpException {
    constructor(message, errorKey) {
        super();
        this.code = 500;
        this.message = message || "服务器错误";
        this.errorKey = errorKey;
    }
}

module.exports = {
    ParameterException,
    NotFoundException,
    AuthFailedException,
    ForbiddenException,
    Success,
    HttpException,
    OtherException
}
