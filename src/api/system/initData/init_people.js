const RoleType = require("../../../config/roleType");

module.exports = [
    {
        userName: "用户名",
        email: "root@163.com",
        password: "123456",
        status: true,
        roleId: RoleType["超级管理员"],
        permissions: ["**_**"].join(",")
    }
];
