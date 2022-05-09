const { passwordHash } = require('../modules/bcrypt.modules');
const { generateUniqueID } = require('../modules/nanoid.modules');

module.exports = {
  insertOneUser: (mongodbConnection, obj) => {
    return new Promise((resolve, reject) => {
      mongodbConnection.userProfile.create({
        id: generateUniqueID("U"),
        firstName: obj.first_name,
        lastName: obj.last_name,
        email: obj.email,
      }).then(async (user) => {
        const hash = await passwordHash(obj.password);
        mongodbConnection.userLogin.create({
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
};