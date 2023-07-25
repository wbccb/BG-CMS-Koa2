const Router = require("koa-router");
const { CreateOrUpdateMenuValidator, DeleteMenuValidator } = require("../validator/system");
const Menu = require("../models/menu");
const { Success, AuthFailedException, HttpException } = require("../lib/http-response");
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
        isIframe: result.get("body.isIframe"), // 是否是外链，即不是组件，而是iframe的形式
    };

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
            menuId: id,
        },
    });

    // 返回结果
    ctx.body = new Success().getData();
});

router.get("/menu/treeselect", async (ctx) => {
    const data = await Menu.findAll();

    // 将所有菜单拼接为树状结构
    let childrenListMap = {};
    let nodeIds = {};
    let tree = [];

    for (const item of data) {
        const parentId = item["parentId"];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        const nodeId = item["menuId"];
        const simpleItem = {
            parentId: item.parentId,
            id: item.menuId,
            label: item.menuName
        };
        nodeIds[nodeId] = simpleItem;
        childrenListMap[parentId].push(simpleItem);
    }

    for (let item of data) {
        // 将最外层的菜单添加到tree，因为最外层的parentId是不存在于nodeIds中的
        // 比如有一个最外层的菜单的parentId是0，0就是代表最外外层的！
        let parentId = item["parentId"];
        if (nodeIds[parentId] == null) {
            const simpleItem = {
                parentId: item.parentId,
                id: item.menuId,
                label: item.menuName
            };
            tree.push(simpleItem);
        }
    }

    function adaptToChildrenList(o) {
        if (childrenListMap[o["id"]] !== null) {
            o["children"] = childrenListMap[o["id"]];
        }
        if (o["children"]) {
            for (let c of o["children"]) {
                adaptToChildrenList(c);
            }
        }
    }

    for (let t of tree) {
        adaptToChildrenList(t);
    }


    const success = new Success();
    success.setData(tree);
    // 返回结果
    ctx.body = success.getData();
});

module.exports = router;
