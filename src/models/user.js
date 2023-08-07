const bcrypt = require("bcryptjs");
const { mySequelize } = require("../lib/my-sequelize");
const { Sequelize, Model, DataTypes } = require("sequelize");
const { AuthFailedException, HttpException, HTTP_CODE, NotFoundException} = require("../lib/http-response");
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

    static generateToken(userId, userLevel) {
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

    static async getUserFromToken(token) {
        var decoded = jwt.decode(token);
        const userId = decoded.userId;
        const user = await User.findOne({
            where:  { id: userId }
        });

        return user;
    }

    /**
     * 更新指定id的数据
     */
    static async updateItemById(result, id) {
        let role = await People.findByPk(id);
        if (!role) {
            throw new NotFoundException({
                code: 10022,
            });
            return;
        }

        role = Object.assign(role, result.get("body"));
        await role.save();
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING(128),
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            set(password2) {
                // 加密
                const salt = bcrypt.genSaltSync(10);
                // 生成加密密码
                const psw = bcrypt.hashSync(password2, salt);
                // 保存到数据
                this.setDataValue("password", psw);
            },
        },
        userName: DataTypes.STRING,
        nickName: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        roleId: DataTypes.INTEGER,
        permissions: DataTypes.STRING
    },
    {
        sequelize: mySequelize,
        tableName: "user",
    }
);

module.exports = User;
