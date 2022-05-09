const { customAlphabet } = require("nanoid");

function generateUniqueID(prefix) {
  const alphanumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nanoid = customAlphabet(alphanumeric, 10);
  const unique = nanoid();
  return prefix + unique;
}

module.exports = {
  generateUniqueID
};