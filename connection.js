const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("otpTask", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
