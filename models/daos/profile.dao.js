const { userProfile, userLogin } = require('../index');

module.exports = {
  insertOneUser: (obj) => {
    return new Promise((resolve, reject) => {
      userProfile.create({
        firstName: obj.first_name,
        lastName: obj.last_name,
        email: obj.email,
      }).then(user => {
        userLogin.create({
          username: obj.username,
          password: obj.password,
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