const { CommonValidator, Rule, RuleResult } = require("../lib/common-validator");
const User = require("../models/user");
const { LoginType } = require("../config/login-type");
const { HttpError } = require("koa");
const { HttpException, HTTP_CODE, Success } = require("../lib/http-response");

class RegisterValidator extends CommonValidator {
    constructor() {
        super();
        this.email = [new Rule("isEmail", "电子邮箱格式不符合规范")];
        this.password1 = [
            new Rule("isLength", "密码至少6个字符，最多22个字符", {
                min: 6,
                max: 22,
            }),
            new Rule("matches", "密码长度必须在6~22位之间，包含字符、数字和 _ "),
        ];
        this.password2 = this.password1;

        this.validateEmail = async function (ctx) {
            const email = ctx.body.email;
            const user = await User.findOne({
                where: {
                    email,
                },
            });
            if (user) {
                return RuleResult.getErrorMsg("邮箱已被注册，请重新输入邮箱", "email");
            }
            return RuleResult.getSuccessMsg();
        };
        this.validatePassword = async function (ctx) {
            const password1 = ctx.body.password1;
            const password2 = ctx.body.password2;
            if (password1 !== password2) {
                return RuleResult.getErrorMsg("两次输入的密码不一致，请重新输入", "password");
            }
            return RuleResult.getSuccessMsg();
        };
    }

    async validatePassword(ctx) { }

    async validateEmail(ctx) { }
}

class LoginValidator extends CommonValidator {
    constructor() {
        super();
        this.email = [new Rule("isEmail", "电子邮箱格式不符合规范")];
        this.password = [
            new Rule("isLength", "密码至少6个字符，最多22个字符", {
                min: 6,
                max: 22,
            }),
            new Rule("matches", "密码长度必须在6~22位之间，包含字符、数字和 _ "),
        ];

        this.validateLoginType = async (ctx) => {
            // 通过bodyparser中间件已经将数据放置在ctx.body中
            const type = ctx.body.type;
            if (!type) {
                return RuleResult.getErrorMsg("登录类型必须传递", "type");
            }

            if (!LoginType.isThisType(type)) {
                return RuleResult.getErrorMsg("不允许该登录方式，请尝试其它方式登录", "type");
            }

            return RuleResult.getSuccessMsg();
        };
    }
}

module.exports = {
    RegisterValidator,
    LoginValidator,
};
