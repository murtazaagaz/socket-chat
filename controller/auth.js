const bcrypt = require("bcrypt");
const User = require("../models/user");
const statusCodes = require("../constants/status-code");
const jwt = require("jsonwebtoken");
const constants = require("../constants/constants");
const utils = require("../utils/utils");

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return utils.badReqResponse("Please Enter All Required Fields!", res);
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return utils.badReqResponse("User does not exists!", res);
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return utils.badReqResponse("Invalid email or password!", res);
  }
  const token = jwt.sign(user.id.toString(), constants.jwtHash);
  return res.status(statusCodes.success).json({
    message: "Login Succes",
    token: token,
    id: user._id.toString(),
  });
};

exports.signup = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (!name || !email || !password) {
      return utils.badReqResponse("Please enter all the required fields", res);
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return utils.badReqResponse("User Already Exists!", res);
    }

    const encryptPass = await bcrypt.hash(password, 12);

    const user = new User({ name: name, email: email, password: encryptPass });
    await user.save();
    const token = jwt.sign(user._id.toString(), constants.jwtHash);

    return res.status(statusCodes.success).json({
      message: "Sign up success!",
      token: token,
      id: user._id.toString(),
    });
  } catch (e) {
    throw e;
  }
};
