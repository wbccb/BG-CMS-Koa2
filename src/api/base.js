/**
 * 实现用户相关的登录注册路由
 */

const Router = require("koa-router");
const {RegisterValidator, LoginValidator} = require("../validator/user");
const User = require("../models/user");
const {Success, AuthFailedException} = require("../lib/http-exception");
const {TokenCheck} = require("../middlewares/token-check");
const {registerSchema} = require("class-validator");
const router = new Router({
    prefix: "/user",
});

router.post("/login", async (ctx) => {
    // 进行token的检测

    const result = await new LoginValidator().validator(ctx);

    // TODO 根据邮箱和密码进行校验是否正确

    const email = result.get("body.email");
    const password = result.get("body.password");

    const user = await User.verifyUserByPassword(email, password);

    // TODO 如果校验通过，则生成token，存储并发放给用户
    if(user) {
        const token = User.generateToken(user.id, TokenCheck.AUSE);
        const response = new Success("登录成功", {
            token
        })
        ctx.status = 201;
        ctx.body = response.getData();
    }

    const errorException = new AuthFailedException("登录失败");
    ctx.status = errorException.getData().code;
    ctx.body = errorException.getData();
});

module.exports = router;
