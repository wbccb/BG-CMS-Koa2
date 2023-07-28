const bcrypt = require("bcryptjs");
const {mySequelize} = require("../lib/my-sequelize");
const {Sequelize, Model, DataTypes} = require("sequelize");
const {AuthFailedException, NotFoundException} = require("../lib/http-response");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

class Role extends Model {
    /**
     * 更新指定id的数据
     */
    static async updateItemById(result, id) {
        let role = await Role.findByPk(id);
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

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        remark: DataTypes.STRING,
        roleId: DataTypes.INTEGER,
        roleName: DataTypes.STRING,
        roleKey: DataTypes.STRING,
        roleSort: DataTypes.INTEGER,
        permissions: DataTypes.STRING,
        admin: DataTypes.BOOLEAN,
    },
    {
        sequelize: mySequelize,
        tableName: "role",
    }
);

module.exports = Role;
