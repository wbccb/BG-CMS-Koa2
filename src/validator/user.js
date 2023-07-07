const {CommonValidator, Rule} = require("../lib/common-validator");

class RegisterValidator extends CommonValidator {
    constructor() {
        super();

        this.email = [new Rule("isEmail", "电子邮箱格式不符合规范")];

        this.password1 = [
            new Rule("isLength", "密码至少6个字符，最多22个字符",        {
                min: 6,
                max: 22,
            }),
            new Rule("matches", "密码长度必须在6~22位之间，包含字符、数字和 _ "),
        ];
        this.password2 = this.password1;
        this.nickName = [
            new Rule("isLength", "昵称长度必须在4~32之间",{
                min: 4,
                max: 32,
            })
        ];
    }

    async validatePassword(ctx) {
        const password1 = ctx.body.password1;
        const password2 = ctx.body.password2;
        if (password1 !== password2) {
            throw new Error("两次输入的密码不一致，请重新输入");
        }
    }

    async validateEmail(ctx) {
        const email = ctx.body.email;
        const user = await User.findOne({
            where: {
                email,
            },
        });
        if (user) {
            throw new Error("邮箱已被注册，请重新输入邮箱");
        }
    }
}

module.exports = {
    RegisterValidator
}
