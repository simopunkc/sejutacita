module.exports = {
  getOneUser: (mongodbConnection, idUser) => {
    return new Promise((resolve, reject) => {
      mongodbConnection.userProfile.findOne({
        id: idUser
      }).then(user => {
        resolve(user);
      }).catch(err => {
        reject(err);
      });
    });
  },
  updateOneUser: (mongodbConnection, obj, idUser) => {
    return new Promise((resolve, reject) => {
      mongodbConnection.userProfile.findOneAndUpdate({
        id: idUser
      }, {
        firstName: obj.first_name,
        lastName: obj.last_name,
        email: obj.email,
      }).then(user => {
        resolve(user);
      }).catch(err => {
        reject(err);
      });
    });
  },
  deleteOneUser: (mongodbConnection, idUser) => {
    return new Promise((resolve, reject) => {
      mongodbConnection.userProfile.findOneAndDelete({
        id: idUser
      }).then(() => {
        return mongodbConnection.userLogin.findOneAndDelete({
          id_user_profiles: idUser
        });
      }).then((login) => {
        resolve(login);
      }).catch(err => {
        reject(err);
      });
    });
  },
};