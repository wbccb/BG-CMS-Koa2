const {mySequelize} = require("../lib/my-sequelize");
const {Sequelize, Model} = require("sequelize");

const bcrypt = require("bcrypt");

/**
 * Model就是直接的数据库操作
 */
class User extends Model {
    static async;
}

User.init(
    {
        id: {
            type: Sequelize.INT24,
            primaryKey: true,
            autoIncrement: true,
        },
        nickname: Sequelize.STRING,
        email: {
            type: Sequelize.STRING(128),
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            set(val) {
                // 加密
                const salt = bcrypt.genSaltSync(10);
                // 生成加密密码
                const psw = bcrypt.hashSync(val, salt);
                this.setDataValue("password", psw);
            },
        },
        openid: {
            type: Sequelize.STRING(64),
            unique: true,
        },
    },
    {
        sequelize: mySequelize,
        tableName: "user",
    }
);
