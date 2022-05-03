const { userProfile, userLogin } = require('../index');
const { encryptJWT } = require('../../controllers/modules/jwt');
const { lifetime } = require('../../controllers/modules/config');
const { passwordHash } = require('../../controllers/modules/bcrypt');

module.exports = {
  insertOneUser: (obj) => {
    return new Promise((resolve, reject) => {
      userProfile.create({
        firstName: obj.first_name,
        lastName: obj.last_name,
        email: obj.email,
      }).then(async (user) => {
        const accToken = encryptJWT({
          username: obj.username,
          expired: lifetime.cookie_acc_token
        })
        const refToken = encryptJWT({
          username: obj.username,
          expired: lifetime.cookie_ref_token
        })
        const hash = await passwordHash(obj.password)
        userLogin.create({
          username: obj.username,
          password: hash,
          accessToken: accToken,
          refreshToken: refToken,
          id_user_profiles: user.id
        })
        resolve(user);
      }).catch(err => {
        reject(err);
      });
    });
  },
  getOneUser: (id) => {
    return new Promise((resolve, reject) => {
      userProfile.findByPk(id,{
        include: 'user_logins'
      }).then(user => {
        resolve(user);
      }).catch(err => {
        reject(err);
      });
    });
  },
  updateOneUser: (obj, id) => {
    return new Promise((resolve, reject) => {
      userProfile.update({
        firstName: obj.first_name,
        lastName: obj.last_name,
        email: obj.email,
      }, {
        where: {id: id}
      }).then(user => {
        resolve(user);
      }).catch(err => {
        reject(err);
      });
    });
  },
  deleteOneUser: (id) => {
    return new Promise((resolve, reject) => {
      userProfile.destroy({
        where: {id: id}
      }).then(user => {
        resolve(user);
      }).catch(err => {
        reject(err);
      });
    });
  },
  userProfile,
  userLogin
};