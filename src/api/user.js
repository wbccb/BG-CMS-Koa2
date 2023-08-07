/**
 * 实现用户相关的登录注册路由
 */

const Router = require("koa-router");
const {RegisterValidator, LoginValidator} = require("../validator/user");
const User = require("../models/user");
const Role = require("../models/role");
const {Success, AuthFailedException, HTTP_CODE, HttpException} = require("../lib/http-response");
const TokenCheck = require("../middlewares/token-check");
const {CreateOrUpdateMenuValidator, DeleteValidator} = require("../validator/system");
const RoleType = require("../config/roleType");
const {Op} = require("sequelize");
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

    // console.log(JSON.stringify(user));

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
        // TODO 如果是直接登录，返回token+用户信息userId+角色roleId
        // TODO 如果是token登录，则返回用户信息userId
        const response = new Success("登录成功", {
            token: token,
            user: user,
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

router.get("/info", async (ctx) => {
    // 根据token获取对应的user数据

    // 从token中取出userId
    const parts = ctx.header.authorization.split(" ");
    if (parts.length === 2) {
        //取出token
        const token = parts[1];
        const user = await User.getUserFromToken(token);

        const success = new Success("获取用户数据成功", {
            user: user,
        });

        ctx.status = 200;
        ctx.body = success.getData();
    } else {
        ctx.status = 200;
        ctx.body = {
            code: HTTP_CODE["用户数据获取失败"],
            desc: "用户数据获取失败",
        };
    }
});

/**
 * 新增用户管理功能
 */
router.post("/people", async (ctx) => {
    // 第一步：校验
    const result = await new CreateOrUpdateMenuValidator().validate(ctx);

    // 第二步：数据库操作
    const user = {
        name: result.get("body.name"),
        email: result.get("body.email"),
        password: result.get("body.password"),
        roleId: result.get("body.roleId"),
        status: result.get("body.status"),
        userId: result.get("body.userId"),
    };
    // Koa使用全局错误捕获，如果await出错，会被中间件捕获错误
    const res = await User.create(user);

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
    const peopleList = await User.findAll();
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
    const params = ctx.params || {};
    let roleArray = [];
    if (params.id) {
        const user = await User.findOne({
            where: {
                id: params.id,
            },
        });
        // 根据user.roleId进行用户的返回
        switch (parseInt(user.roleId)) {
            case RoleType.超级管理员:
                console.log("检测到你是超级管理员，返回系统管理员和普通用户");
                // 拿到所有roleId=系统管理员+普通用户
                // SELECT * FROM post WHERE authorId = 12 OR authorId = 13;
                roleArray = await Role.findAll({
                    where: {
                        [Op.or]: [{roleType: RoleType["系统管理员"]}, {roleType: RoleType["普通用户"]}],
                    },
                });
                break;
            case RoleType.系统管理员:
                roleArray = await Role.findAll({
                    where: {
                        roleType: RoleType["普通用户"],
                    },
                });
                break;
            case RoleType.普通用户:
                roleArray = [];
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
