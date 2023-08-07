const Router = require("koa-router");
const { CreateOrUpdateMenuValidator, DeleteValidator } = require("../../validator/system");
const Role = require("../../models/role");
const { Success, AuthFailedException, HttpException } = require("../../lib/http-response");
const TokenCheck = require("../../middlewares/token-check");
const { LoginValidator } = require("../../validator/user");
const User = require("../../models/user");
const {adaptToChildrenList} = require("../../lib/util");
const {DataTypes} = require("sequelize");
const router = new Router({
    prefix: "/system",
});


/**
 * 新增menu功能
 */
router.post("/role", async (ctx) => {
    // 第一步：校验
    const result = await new CreateOrUpdateMenuValidator().validate(ctx);

    // 第二步：数据库操作
    const role = {
        roleName: result.get("body.roleName"),
        roleType: result.get("body.roleType"),
        roleIdName: result.get("body.roleIdName"),
        roleSort: result.get("body.roleSort"),
        permissions: result.get("body.permissions"),
    };
    // Koa使用全局错误捕获，如果await出错，会被中间件捕获错误
    const res = await Role.create(role);

    // 第三步：返回response结果
    ctx.body = new Success().getData();
});

router.put("/role", async (ctx) => {
    // 校验参数
    const result = await new CreateOrUpdateMenuValidator().validate(ctx);

    // 数据库操作：更新item
    // Koa使用全局错误捕获，如果await出错，会被中间件捕获错误
    const id = result.get("body.id");
    await Role.updateItemById(result, id);

    // 根据数据库操作返回结果
    ctx.body = new Success().getData();
});

router.get("/role", async (ctx) => {
    // TODO 这里需要分页，需要根据pageNo和pageSize返回结果

    const roleList = await Role.findAll();
    const success = new Success();
    success.setData({
        total: roleList.length,
        list: roleList,
        pageNo: 1,
        pageSize: roleList.length
    });

    ctx.body = success.getData();
});


router.delete("/role", async (ctx) => {
    // 第一步：检验参数
    const result = await new DeleteValidator().validate(ctx);

    // TODO 应该挪到Validator()中进行声明
    const id = ctx.query ? ctx.query.id : "";
    if (!id) {
        // desc, responseCode, httpCode
        ctx.body = new HttpException("id为空").getData();
        return;
    }

    // 第二步：数据库操作
    await Role.destroy({
        where: {
            id: id,
        },
    });

    // 第三步：返回response结果
    ctx.body = new Success().getData();
});


module.exports = router;
