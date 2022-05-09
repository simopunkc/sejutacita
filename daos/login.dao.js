const jwt = require('../modules/jwt.modules');
const { generateExpiredAccToken, generateExpiredRefToken } = require("../modules/date.modules");
const bcrypt = require('../modules/bcrypt.modules');

module.exports = {
  authUser: (mongodbConnection, obj) => {
    return new Promise((resolve, reject) => {
      mongodbConnection.userLogin.findOne({
        username: obj.username
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
};