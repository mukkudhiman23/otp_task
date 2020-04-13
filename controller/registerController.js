const Register = require("../model/register");
const sendOTP = require("../model/sendOtp");
const moment = require("moment");
const config = require("../common/mailConfig");
const transporter = require("../common/configration");

exports.registerUser = async (data) => {
  try {
    let randomOTP = Math.floor(100000 + Math.random() * 900000);
    let expiry_date = moment(Date()).add(15, "m").toDate();

    const register = await Register.create({
      username: data.username,
      email: data.email,
    });

    if (!register) {
      return {
        status: 400,
        data: {
          msg: "Something gone wrong",
        },
      };
    }
    const sendOtp = await sendOTP.create({
      otp: randomOTP,
      try: 0,
      expired_at: expiry_date,

      user_id: register.id,
    });
    if (!sendOtp) {
      return {
        status: 400,
        data: {
          msg: "Something gone wrong!!",
        },
      };
    }

    let mailOptions = {
      from: config.from,
      to: data.email,
      subject: "OTP Authentication Demo",
      text: "OTP for email varification" + randomOTP,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 200,
      data: {
        msg: "Record added successfully",
      },
    };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      data: {
        msg: "Something went wrong!",
      },
    };
  }
};

exports.retryUser = async (params) => {
  try {
    const id = params.id;

    const userData = await Register.findOne({
      where: { id: id },
    });

    if (!userData) {
      return {
        status: 400,
        data: {
          msg: "User does not exists!!",
        },
      };
    }

    const OTPData = await sendOTP.findOne({
      where: { user_id: id },
    });

    if (!OTPData) {
      return {
        status: 400,
        data: {
          msg: "Record not exists!",
        },
      };
    }

    if (OTPData.try >= 2) {
      return {
        status: 400,
        data: {
          msg: "Retry not possible more than 2 times!",
        },
      };
    }

    let randomOTP = Math.floor(100000 + Math.random() * 900000);
    let Expired_date = moment(Date(OTPData.expiry_date)).add(15, "m").toDate();

    const updatedOTP = await OTPData.update({
      otp: randomOTP,
      expired_date: Expired_date,
      try: OTPData.try + 1,
    });

    if (!updatedOTP) {
      return {
        status: 400,
        data: {
          msg: "Something went wrong!",
        },
      };
    }

    let mailOptions = {
      from: config.from,
      to: userData.email,
      subject: "OTP Authentication Demo",
      text: "OTP for email varification" + randomOTP,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 200,
      data: {
        msg: "OTP have been sent on your mail!",
      },
    };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      data: {
        msg: "Something went wrong!",
      },
    };
  }
};

exports.verifyUser = async (data) => {
  try {
    const userData = await Register.findOne({
      where: { id: data.user_id },
    });

    if (!userData) {
      return {
        status: 400,
        data: {
          msg: "User does not exists!",
        },
      };
    }

    const OTPData = await sendOTP.findOne({
      where: { user_id: data.user_id, otp: data.otp },
    });

    if (!OTPData) {
      return {
        status: 400,
        data: {
          msg: "Please enter valid otp!",
        },
      };
    }

    await OTPData.destroy();

    return {
      status: 200,
      data: {
        msg: "OTP verified!",
      },
    };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      data: {
        msg: "Something went wrong!",
      },
    };
  }
};
