const bcrypt = require("bcryptjs");
const { mySequelize } = require("../lib/my-sequelize");
const { Sequelize, Model, DataTypes } = require("sequelize");
const { AuthFailedException, NotFoundException } = require("../lib/http-exception");
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
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        menuName: Sequelize.STRING,
        parentId: Sequelize.INTEGER,
        orderNum: Sequelize.INTEGER,
        path: Sequelize.STRING,
        component: Sequelize.STRING,
        menuType: Sequelize.STRING,
        visible: Sequelize.STRING,
        status: Sequelize.STRING,
    },
    {
        sequelize: mySequelize,
        tableName: "menu",
    }
);

module.exports = Menu;
