const dbConnection = require('./mongodb.database');

const getModel = async () => {
  try {
    let database = await dbConnection.getDb();
    if(database == null){
      database = await dbConnection.connectDb();
    }
    const userLogin = require('./schema.login.model')(database);
    const userProfile = require('./schema.profile.model')(database);
    return {
      userLogin,
      userProfile,
    }
  } catch (err) {
    return {
      userLogin: {},
      userProfile: {},
    }
  }
};

module.exports = {
  getModel
};