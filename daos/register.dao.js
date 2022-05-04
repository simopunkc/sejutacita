const { userProfile, userLogin } = require('../models/index');
const { passwordHash } = require('../modules/bcrypt.modules');

module.exports = {
  insertOneUser: (obj) => {
    return new Promise((resolve, reject) => {
      userProfile.create({
        firstName: obj.first_name,
        lastName: obj.last_name,
        email: obj.email,
      }).then(async (user) => {
        const hash = await passwordHash(obj.password)
        userLogin.create({
          username: obj.username,
          password: hash,
          id_user_profiles: user.id
        })
        resolve(user);
      }).catch(err => {
        reject(err);
      });
    });
  },
  userProfile,
  userLogin
};