module.exports = {
    environment: "dev",
    database: {
        dbName: "mysql",
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "123456",
    },
    security: {
        secretKey: "abcdefg", // token加密的密钥
        expiresIn: 60 * 60,
    },
};
