const Router = require("koa-router");
const { CreateOrUpdateMenuValidator, DeleteMenuValidator } = require("../validator/system");
const Menu = require("../models/menu");
const { Success, AuthFailedException, HttpException } = require("../lib/http-exception");
const TokenCheck = require("../middlewares/token-check");
const { LoginValidator } = require("../validator/user");
const User = require("../models/user");
const router = new Router({
    prefix: "/system",
});


/**
 * 新增menu功能
 */
router.post("/menu", async (ctx) => {

    // 校验
    const result = await new CreateOrUpdateMenuValidator().validate(ctx);

    // 数据库操作
    const menu = {
        menuName: result.get("body.menuName"),
        parentId: result.get("body.parentId"),
        orderNum: result.get("body.orderNum"),
        path: result.get("body.path"), // 路由hash值
        component: result.get("body.component"),
        menuType: result.get("body.menuType"),
        visible: result.get("body.visible"),
        status: result.get("body.status"),
        isIframe: result.get("body.isIframe") // 是否是外链，即不是组件，而是iframe的形式
    }

    const res = await Menu.create(menu);

    // 返回结果
    ctx.body = new Success().getData();
});

router.put("/menu", async (ctx) => {
    const result = await new CreateOrUpdateMenuValidator().validate(ctx);

    const id = result.get("body.menuId");

    // 将所有没有姓氏的人更改为 "Doe"
    await Menu.updateItemById(result, id);

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

router.delete("/menu", async (ctx) => {
    const result = await new DeleteMenuValidator().validate(ctx);

    const id = ctx.query ? ctx.query.id : "";
    if (!id) {
        ctx.body = new HttpException("id为空").getData();
        return;
    }

    // 将所有没有姓氏的人更改为 "Doe"
    await Menu.destroy({
        where: {
            menuId: id
        }
    });

    // 返回结果
    ctx.body = new Success().getData();
});



module.exports = router;