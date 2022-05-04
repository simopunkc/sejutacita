require('dotenv').config();
const jwt = require("jsonwebtoken");
const { env } = process;

function encryptJWT(token) {
  return jwt.sign(token, env.JWT_SECRET);
}

function decryptJWT(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

module.exports = {
  encryptJWT,
  decryptJWT,
};
