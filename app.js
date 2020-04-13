const express = require("express");

const app = express();

const sequelize = require("./connection");
const bodyParser = require("body-parser");
const registerRoute = require("./Routes/registerRoute");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", registerRoute);

const Register = require("./model/register");
const sendOtp = require("./model/sendOtp");

Register.hasMany(sendOtp, { foreignKey: "user_id" });

sequelize

  .sync()
  .then((result) => {
    // console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(4000, (req, res) => {
  console.log("server is listening at", 4000);
});
