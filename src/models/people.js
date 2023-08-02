const bcrypt = require("bcryptjs");
const {mySequelize} = require("../lib/my-sequelize");
const {Sequelize, Model, DataTypes} = require("sequelize");
const {AuthFailedException, NotFoundException} = require("../lib/http-response");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

class People extends Model {
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

People.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: DataTypes.STRING,
        userName: DataTypes.STRING,
        nickName: DataTypes.STRING,
        email: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        roleId: DataTypes.STRING, // 角色标记
        permissions: DataTypes.STRING
    },
    {
        sequelize: mySequelize,
        tableName: "people",
    }
);

module.exports = People;
