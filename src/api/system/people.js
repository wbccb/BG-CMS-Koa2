const Router = require("koa-router");
const {CreateOrUpdateMenuValidator, DeleteValidator} = require("../../validator/system");
const People = require("../../models/people");
const {Success, AuthFailedException, HttpException} = require("../../lib/http-response");
const TokenCheck = require("../../middlewares/token-check");
const {LoginValidator} = require("../../validator/user");
const User = require("../../models/user");
const {adaptToChildrenList} = require("../../lib/util");
const {DataTypes, Op} = require("sequelize");
const RoleType = require("../../config/roleType");

const router = new Router({
    prefix: "/system",
});

/**
 * 新增用户管理功能
 */
router.post("/people", async (ctx) => {
    // 第一步：校验
    const result = await new CreateOrUpdateMenuValidator().validate(ctx);

    // 第二步：数据库操作
    const role = {};
    // Koa使用全局错误捕获，如果await出错，会被中间件捕获错误
    const res = await Role.create(role);

    // 第三步：返回response结果
    ctx.body = new Success().getData();
});

router.put("/people", async (ctx) => {
    // 校验参数
    const result = await new CreateOrUpdateMenuValidator().validate(ctx);

    // 数据库操作：更新item
    // Koa使用全局错误捕获，如果await出错，会被中间件捕获错误
    const id = result.get("body.id");
    await Role.updateItemById(result, id);

    // 根据数据库操作返回结果
    ctx.body = new Success().getData();
});

router.get("/people", async (ctx) => {
    // TODO 这里需要分页，需要根据pageNo和pageSize返回结果
    const peopleList = await People.findAll();
    const success = new Success();
    success.setData({
        total: peopleList.length,
        list: peopleList,
        pageNo: 1,
        pageSize: peopleList.length,
    });

    ctx.body = success.getData();
});

// 查询该用户可以控制的角色
// 比如超级管理员：分配公司管理员、普通用户
// 比如公司管理员：普通用户
// 比如普通用户：无法分配任何角色
router.get("/people/authRole/:id", async (ctx) => {
    //TODO 现在正在做这个接口，我们需要初始化权限体系，包括
    //TODO  roleId: "", permission: []

    // 针对创建用户方面：
    // 1. 下面的创建用户分配权限，直接根据目前roleId进行区分
    // - 超级管理员：系统管理员（创建、更新、删除）、普通用户（创建、更新、删除）
    // - 系统管理员：普通用户（创建、更新、删除）
    // - 普通用户：没有任何权限
    // 2. 只有一个超级管理员
    const query = ctx.request.query || {};
    let roleArray = [];
    if (query.id) {
        const user = await User.findOne({
            where: {
                id: query.id,
            },
        });
        // 根据user.roleId进行用户的返回
        switch (user.roleId) {
            case RoleType.超级管理员:
                // 拿到所有roleId=系统管理员+普通用户
                // SELECT * FROM post WHERE authorId = 12 OR authorId = 13;
                roleArray = People.findAll({
                    where: {
                        [Op.or]: [
                            {
                                roleId: RoleType["系统管理员"],
                            },
                            {
                                roleId: RoleType["普通用户"],
                            },
                        ],
                    },
                });
                break;
            case RoleType.系统管理员:
                roleArray = People.findAll({
                    where: {
                        roleId: RoleType["普通用户"],
                    },
                });
                break;
            case RoleType.普通用户:
                break;
        }
    }

    const success = new Success();
    success.setData({
        list: roleArray,
    });
    // console.log(query);
    ctx.body = success.getData();
});

router.delete("/people", async (ctx) => {
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
