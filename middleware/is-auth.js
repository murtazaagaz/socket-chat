const utils = require('../utils/utils')
module.exports = (req, res, next) => {
  try {
    const token = req.get("Authorization").split(" ")[1];

    const decoded = utils.decodeToken(token);
    req.userId = decoded;
    next();
  } catch (e) {
    e.statusCode = 401;
    throw e;
  }
};
