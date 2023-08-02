require("module-alias/register");
const Menu = require("./models/menu");
const Role = require("./models/role");
const People = require("./models/people");
const Koa = require("koa");
const parser = require("koa-bodyparser");
const catchError = require("./middlewares/response-handle-error");
const InitManager = require("./init");
const TokenCheck = require("./middlewares/token-check");

const app = new Koa();
app.use(catchError); // 全局捕获错误
app.use(parser()); // 自动处理参数，然后将参数解析放在ctx.request.body中

app.use(new TokenCheck().getCheckMiddleWare());
// app.use(async(ctx, next) => {
//     // TODO 进行token的验证，如果验证通过
//
//     // `permissions`使用`method`+`url`的集合，比如`delete_system/role`表示删除某个角色的权限
//
//     // 从cookie中获取token
//     const token = ctx.cookies.get("Admin-Token");
//     console.log("拿到的token", token);
//
//
//     // 验证token
//
//
//
//     await next();
// });

InitManager.initCore(app); // 路由自动加载，全局错误对象赋值和全局config配置赋值


app.listen(3000);
console.log("app运行在3000");