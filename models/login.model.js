module.exports = (sequelize, Sequelize) => {
  const userLogin = sequelize.define('user_logins', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    id_user_profiles: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  }, { timestamps: false });
  return userLogin;
};