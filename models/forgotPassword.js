const Sequelize = require("sequelize");
const sequelize = require("../util/db");

const ForgotPassword = sequelize.define("forgotpassword", {
    id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
    },
});
module.exports = ForgotPassword;