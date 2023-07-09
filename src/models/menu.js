const bcrypt = require("bcryptjs");
const {mySequelize} = require("../lib/my-sequelize");
const {Sequelize, Model, DataTypes} = require("sequelize");
const {AuthFailedException} = require("../lib/http-exception");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

/**
 * Model就是直接的数据库操作
 */
class Menu extends Model {

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
