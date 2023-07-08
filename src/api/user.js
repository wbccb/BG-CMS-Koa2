/**
 * 实现用户相关的登录注册路由
 */

const Router = require("koa-router");
const { RegisterValidator, LoginValidator } = require("../validator/user");
const User = require("../models/user");
const { Success, AuthFailedException } = require("../lib/http-exception");
const TokenCheck = require("../middlewares/token-check");
const router = new Router({
    prefix: "/user",
});

router.post("/register", async (ctx) => {
    // 第一步：检验请求参数
    const validator = new RegisterValidator();
    const res = await validator.validate(ctx);
    // 第二步：数据库操作
    const user = {
        email: res.get("body.email"),
        password: res.get("body.password2"),
        nickname: res.get("body.nickName"),
    };

    console.log(JSON.stringify(user));

    // 数据库插入行数据
    // set password会自动进行加密操作
    await User.create(user);

    // 第三步：返回结果
    ctx.body = new Success().getData();
});

router.post("/login", async (ctx) => {
    // 进行token的检测

    const result = await new LoginValidator().validate(ctx);

    // 根据邮箱和密码进行校验是否正确
    const email = result.get("body.email");
    const password = result.get("body.password");

    const user = await User.verifyUserByPassword(email, password);

    // 如果校验通过，则生成token，存储并发放给用户
    if (user) {
        const token = User.generateToken(user.id, TokenCheck.AUSE);
        const response = new Success("登录成功", {
            token,
        });
        console.log("获取token成功", token);
        ctx.status = 201;
        ctx.body = response.getData();
        return;
    }

    // 登录失败，则返回对应的状态码
    const errorException = new AuthFailedException("登录失败");
    ctx.status = errorException.getData().code;
    ctx.body = errorException.getData();
});

router.post("/logout", async (ctx) => {
    // token的清除

    // 返回成功标志
    const response = new Success("登出成功");
    ctx.status = 201;
    ctx.body = response.getData();
});

module.exports = router;
