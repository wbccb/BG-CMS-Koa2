require("module-alias/register");

const Koa = require("koa");
const parser = require("koa-bodyparser");
const catchError = require("./middlewares/exception");
const InitManager = require("./init");

const app = new Koa();
app.use(catchError); // 全局捕获错误
app.use(parser()); // 自动处理参数，然后将参数解析放在ctx.request.body中
InitManager.initCore(app); // 路由自动加载，全局错误对象赋值和全局config配置赋值

app.listen(3000);
