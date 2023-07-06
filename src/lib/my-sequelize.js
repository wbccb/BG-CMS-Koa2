const Sequelize = require("sequelize");

const {dbName, host, port, user, password} = require("../config/config").database;

const mySequelize = new Sequelize(dbName, user, password, {
    dialect: "mysql",
    host,
    port,
    logging: true,
    timezone: "+08:00",
    define: {
        timestamps: true, // create_time && update_time
        paranoid: true, // delete_time
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
        underscored: true,
        freezeTableName: true,
        scopes: {
            bh: {
                attributes: {
                    exclude: ["updated_at", "deleted_at", "created_at"],
                },
            },
        },
    },
});

mySequelize.sync({
    force: false,
});
module.exports = {
    mySequelize,
};
