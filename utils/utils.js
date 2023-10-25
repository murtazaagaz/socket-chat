const statusCodes = require("../constants/status-code");
const constants = require("../constants/constants");
const jwt = require("jsonwebtoken");

exports.badReqResponse = (errorMessage, res) => {
  res.status(statusCodes.badRequest).json({
    message: errorMessage,
  });
};

exports.decodeToken = (token) => {
  try {
    const error = Error("Authorization Failed!");
    error.statusCode = 401;

    if (!token) {
      throw error;
    }
    const decoded = jwt.verify(token, constants.jwtHash);
    if (!decoded) {
      throw error;
    }

    return decoded;
  } catch (e) {
    e.statusCode = 401;
    throw e;
  }
};
