const bcrypt = require("bcryptjs");
const { mySequelize } = require("../lib/my-sequelize");
const { Sequelize, Model, DataTypes } = require("sequelize");
const { AuthFailedException, HttpException, HTTP_CODE } = require("../lib/http-response");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

/**
 * Model就是直接的数据库操作
 */
class User extends Model {
    static async verifyUserByPassword(email, password) {
        // 通过邮箱和密码检测是否正确

        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            throw new AuthFailedException();
            return;
        }

        // 校验密码: 原始密码与user的加密密码进行比对，不能单纯使用===
        const res = bcrypt.compareSync(password, user.password);

        if (!res) {
            throw new HttpException("密码错误", HTTP_CODE["账号/密码错误"]);
            return;
        }

        return user;
    }

    static async generateToken(userId, userLevel) {
        const secretKey = config.security.secretKey;
        const expiresIn = config.security.expiresIn;

        const token = jwt.sign(
            {
                userId,
                userLevel,
            },
            secretKey,
            {
                expiresIn: expiresIn,
            }
        );

        return token;
    }
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
            set(password2) {
                // 加密
                const salt = bcrypt.genSaltSync(10);
                // 生成加密密码
                const psw = bcrypt.hashSync(password2, salt);
                // 保存到数据
                this.setDataValue("password", psw);
            },
        },
    },
    {
        sequelize: mySequelize,
        tableName: "user",
    }
);

module.exports = User;
