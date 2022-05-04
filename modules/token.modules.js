const { getCurrentTimestamp } = require("./date.modules");

function isExpiredRefToken(expired) {
  return expired >= getCurrentTimestamp() ? false : true;
}

function isExpiredAccToken(expired) {
  return expired >= getCurrentTimestamp() ? false : true;
}

module.exports = {
  isExpiredRefToken,
  isExpiredAccToken
};
