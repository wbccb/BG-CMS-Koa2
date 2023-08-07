const RoleType = require("../../../config/roleType");

module.exports = [
    {
        userName: "用户名",
        email: "188132221@163.com",
        password: "123456",
        status: true,
        roleId: RoleType["超级管理员"],
        permissions: ["**_**"].join(",")
    }
];
