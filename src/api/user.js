/**
 * 实现用户相关的登录注册路由
 */

const Router = require("koa-router");
const { RegisterValidator } = require("../validator/user");
const User = require("../models/user");
const { Success } = require("../lib/http-exception");
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
    await User.create(user);

    // 第三步：返回结果
    ctx.body = new Success().getData();
});

module.exports = router;
