/**
 * 全局的异常处理，包括各种错误的状态码
 */

const HTTP_CODE = {
    "用户不存在": 10001,
    "账号/密码错误": 10002,
    "登录超时": 10003,
    "邮箱已被注册，请重新输入邮箱": 10011,
    "注册失败": 10012,
    "两次输入的密码不一致，请重新输入": 10013,
    "参数无法通过校验，请检查参数数据": 10021,
    "TOKEN验证失败，请重新登录": 401,
};

class HttpResponse extends Error {
    constructor(desc, responseCode, httpCode) {
        super();
        this.desc = desc || "成功";
        this.httpCode = httpCode || 200; // 默认200，会影响response.statusCode
        this.code = responseCode;
        this.data = {};
    }

    getData() {
        // status:
        // desc:
        // httpCode:
        // path:
        // method:
        const obj = {
            code: this.code,
            desc: this.desc,
            data: this.data,
        };
        if (this.errorKey) {
            obj.data.errorKey = this.errorKey;
        }
        return obj;
    }

    getStatusCode() {
        return this.httpCode;
    }
}

class ParameterException extends HttpResponse {
    constructor(desc, errorKey) {
        super();
        this.code = HTTP_CODE["参数无法通过校验，请检查参数数据"];
        this.desc = desc || "参数无法通过校验，请检查参数数据";
        this.errorKey = errorKey;
    }
}

class NotFoundException extends HttpResponse {
    constructor(httpCode, desc) {
        super();
        this.httpCode = httpCode || 404;
        this.desc = desc || "资源未找到";
    }
}

class AuthFailedException extends HttpResponse {
    constructor(httpCoe, desc) {
        super();
        this.httpCode = 401;
        this.desc = desc || "授权失败";
    }
}

class ForbiddenException extends HttpResponse {
    constructor(desc) {
        super();
        this.httpCode = 403;
        this.desc = desc || "禁止访问";
    }
}

class Success extends HttpResponse {
    constructor(desc, data) {
        super();
        this.code = 0;
        this.desc = desc || "成功";
        this.data = data;
    }

    setData(data) {
        this.data = data;
    }
}

class OtherException extends HttpResponse {
    constructor(desc, errorKey) {
        super();
        this.httpCode = 500;
        this.desc = desc || "服务器错误";
        this.errorKey = errorKey;
    }
}

module.exports = {
    ParameterException,
    NotFoundException,
    AuthFailedException,
    ForbiddenException,
    Success,
    HttpException: HttpResponse,
    OtherException,
    HTTP_CODE
};
