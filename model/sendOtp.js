const Sequelize = require("sequelize");

const sequelize = require("../connection");

const sendOtp = sequelize.define("sendOtp", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  otp: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  try: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  expired_at: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = sendOtp;
