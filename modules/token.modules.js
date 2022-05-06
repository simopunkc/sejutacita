const { getCurrentTimestamp } = require("./date.modules");

function isExpiredRefToken(expired) {
  return expired >= getCurrentTimestamp() ? false : true;
}

function isExpiredAccToken(expired) {
  return expired >= getCurrentTimestamp() ? false : true;
}

function validateIdToken(refToken, accToken) {
  return refToken.id != accToken.id ? false : true;
}

module.exports = {
  isExpiredRefToken,
  isExpiredAccToken,
  validateIdToken
};
