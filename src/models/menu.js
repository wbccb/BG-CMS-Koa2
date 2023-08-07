const bcrypt = require("bcryptjs");
const { mySequelize } = require("../lib/my-sequelize");
const { Sequelize, Model, DataTypes } = require("sequelize");
const { AuthFailedException, NotFoundException } = require("../lib/http-response");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

/**
 * Model就是直接的数据库操作
 */
class Menu extends Model {
    // TODO 后期可以将这些方法移值到dao文件夹下

    static async updateItemById(result, id) {
        let menu = await Menu.findByPk(id);
        if (!menu) {
            throw new NotFoundException({
                code: 10022,
            });
            return;
        }

        console.log("result.get(\"body\")", JSON.stringify(result.get("body")));
        menu = Object.assign(menu, result.get("body"));
        await menu.save();
    }
}

Menu.init(
    {
        menuId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        menuName: DataTypes.STRING, // meta.title
        parentId: DataTypes.INTEGER,
        orderNum: DataTypes.INTEGER,
        path: DataTypes.STRING, // 路由路径
        name: DataTypes.STRING, // 路由名称
        component: DataTypes.STRING,
        menuType: DataTypes.STRING,
        visible: DataTypes.STRING,
        status: DataTypes.STRING,
    },
    {
        sequelize: mySequelize,
        tableName: "menu",
    }
);

module.exports = Menu;
