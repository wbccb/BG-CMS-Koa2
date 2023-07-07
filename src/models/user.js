const {mySequelize} = require("../lib/my-sequelize");
const {Sequelize, Model, DataTypes} = require("sequelize");

const bcrypt = require("bcryptjs");

/**
 * Model就是直接的数据库操作
 */
class User extends Model {
    static async verifyUserByPassword(email, password) {
        // 通过邮箱和密码检测是否正确

        const user = await User.findOne({
            where: {email},
        });

        if (!user) {
            // TODO 校验规则可以放在this.errors，然后触发最后一个中间件进行try-catch
            // 那如果是其它业务呢？错误如何统一起来？
        }

        return {
            id: user.id,
        };
    }

    static async generateToken(id, type) {}
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
            set(val) {
                // 加密
                const salt = bcrypt.genSaltSync(10);
                // 生成加密密码
                const psw = bcrypt.hashSync(val, salt);
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
