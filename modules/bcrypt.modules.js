const bcrypt = require("bcrypt");

async function passwordHash(password) {
  const saltRounds = 8
  const salt = bcrypt.genSaltSync(saltRounds);
  return await bcrypt.hash(password, salt);
}

async function compareHash(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  passwordHash,
  compareHash
};