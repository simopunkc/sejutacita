module.exports = (sequelize, Sequelize) => {
  const login = sequelize.define('user_login', {
    // TBD
  }, { timestamps: false });
  return login;
};