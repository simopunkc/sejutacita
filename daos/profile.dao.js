const { userProfile, userLogin } = require('../models/index');

module.exports = {
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