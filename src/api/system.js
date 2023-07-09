const Router = require("koa-router");
const { CreateMenuValidator } = require("../validator/system");
const Menu = require("../models/menu");
const { Success, AuthFailedException } = require("../lib/http-exception");
const TokenCheck = require("../middlewares/token-check");
const {LoginValidator} = require("../validator/user");
const User = require("../models/user");
const router = new Router({
    prefix: "/system",
});


/**
 * 新增menu功能
 */
router.post("/menu", async (ctx) => {

    // 校验
    const result = await new CreateMenuValidator().validate(ctx);

    // 数据库操作
    const menu = {
        menuName: result.get("body.menuName"),
        parentId: result.get("body.parentId"),
        orderNum: result.get("body.orderNum"),
        path: result.get("body.path"), // 路由hash值
        component: result.get("body.component"),
        menuType: result.get("body.menuType"),
        visible: result.get("body.visible"),
        status: result.get("body.status")
    }

    const res = await Menu.create(menu);

    // 返回结果
    ctx.body = new Success().getData();
});

router.get("/menu", async (ctx) => {
    // 这里不需要分页，直接获取所有

    const menuList = await Menu.findAll();
    const success = new Success();
    success.setData(menuList);

    ctx.body = success.getData();
});




module.exports = router;