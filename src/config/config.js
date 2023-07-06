module.exports = {
    environment: "dev",
    database: {
        dbName: "",
        host: "",
        port: 3300,
        use: "root",
        password: "12345",
    },
    security: {
        secretKey: "abcdefg", // token加密的密钥
        expiresIn: 60 * 60,
    },
};
