module.exports = {
    environment: "dev",
    database: {
        dbName: "",
        host: "",
        port: 3306,
        use: "root",
        password: "123456",
    },
    security: {
        secretKey: "abcdefg", // token加密的密钥
        expiresIn: 60 * 60,
    },
};
