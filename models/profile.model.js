module.exports = (sequelize, Sequelize) => {
  const profile = sequelize.define('user_profile', {
    // TBD
  }, { timestamps: true });
  return profile;
};