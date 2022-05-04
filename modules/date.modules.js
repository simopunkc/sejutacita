const { lifetime } = require("../configs/lifetime.config");

function getCurrentTimestamp() {
  return new Date().getTime();
}

function generateExpiredAccToken() {
  return getCurrentTimestamp()+lifetime.cookie_acc_token
}

function generateExpiredRefToken() {
  return getCurrentTimestamp()+lifetime.cookie_ref_token
}

module.exports = {
  getCurrentTimestamp,
  generateExpiredAccToken,
  generateExpiredRefToken
};
