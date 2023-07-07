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
        nickname: res.get("body.nickname"),
    };

    // 数据库插入行数据
    // const databaseRes = await User.create(user);

    ctx.body = new Success().getData();
    // 第三步：返回结果
});

router.get("/test", async (ctx) => {

    // 第三步：返回结果
    ctx.body = {
        code: 0,
    };
});

module.exports = router;
