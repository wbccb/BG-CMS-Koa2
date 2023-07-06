/**
 * 实现用户相关的登录注册路由
 */

const Router = require("koa-router");
const {RegisterValidator} = require("../validator/user");
const User = require("../models/user");
const {Success} = require("../lib/http-exception");
const router = new Router({
    prefix: "/user",
});

router.post("/register", async (ctx) => {
    // 第一步：检验请求参数
    const res = await new RegisterValidator().validate(ctx);
    // 第二步：数据库操作
    const user = {
        email: res.get("body.email"),
        password: res.get("body.password2"),
        nickname: res.get("body.nickname"),
    };

    // 数据库插入行数据
    const databaseRes = await User.create(user);

    // 第三步：返回结果
    ctx.success(Success.getData());
});
