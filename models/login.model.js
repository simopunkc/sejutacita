module.exports = (sequelize, Sequelize) => {
  const userLogin = sequelize.define('user_logins', {
    id_user_profiles: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    accessToken: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  }, { timestamps: false });
  return userLogin;
};