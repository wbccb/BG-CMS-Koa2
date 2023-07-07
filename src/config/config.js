module.exports = {
    environment: "dev",
    database: {
        dbName: "db_test",
        host: "localhost",
        port: 3306,
        user: "root",
        password: "123456",
    },
    security: {
        secretKey: "abcdefg", // token加密的密钥
        expiresIn: 60 * 60,
    },
};
