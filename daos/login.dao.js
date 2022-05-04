const { userProfile, userLogin } = require('../models/index');
const jwt = require('../modules/jwt.modules');
const { generateExpiredAccToken, generateExpiredRefToken } = require("../modules/date.modules");
const token = require('../modules/token.modules');
const bcrypt = require('../modules/bcrypt.modules');
const role = require('../modules/role.modules');

module.exports = {
  authUser: (obj) => {
    return new Promise((resolve, reject) => {
      userLogin.findOne({
        where: {
          username: obj.username
        }
      }).then(async (login) => {
        const validLogin = await bcrypt.compareHash(obj.password, login.password)
        if(validLogin){
          const newAccToken = jwt.encryptJWT({
            id: login.id_user_profiles,
            username: login.username,
            expired: generateExpiredAccToken(),
            role: login.role
          })
          const newRefToken = jwt.encryptJWT({
            id: login.id_user_profiles,
            username: login.username,
            expired: generateExpiredRefToken(),
            role: login.role
          });
          resolve({
            accToken: newAccToken,
            refToken: newRefToken
          })
        }else{
          reject(new Error("wrong password"));
        }
      }).catch(err => {
        reject(err);
      });
    });
  },
  updateAccToken: (refToken) => {
    return new Promise((resolve) => {
      const newAccToken = jwt.encryptJWT({
        id: refToken.id,
        username: refToken.username,
        expired: generateExpiredAccToken(),
        role: refToken.role
      })
      resolve({
        accToken: newAccToken
      })
    });
  },
  userProfile,
  userLogin,
  token,
  jwt,
  role
};