const {mySequelize} = require("../lib/my-sequelize");
const {Sequelize, Model, DataTypes} = require("sequelize");

// const bcrypt = require("bcrypt");

/**
 * Model就是直接的数据库操作
 */
class User extends Model {
}

User.init(
    {
        id: {
            type: Sequelize.INTEGER,
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
            // set(val) {
            //     // 加密
            //     const salt = bcrypt.genSaltSync(10);
            //     // 生成加密密码
            //     const psw = bcrypt.hashSync(val, salt);
            //     this.setDataValue("password", psw);
            // },
        }
    },
    {
        sequelize: mySequelize,
        tableName: "user",
    }
);

module.exports = User;
