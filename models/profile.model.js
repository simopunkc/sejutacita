module.exports = (database) => {
  const userProfile = database.sequelize.define('user_profiles', {
    id: {
      type: database.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: database.Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: database.Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: database.Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  }, { timestamps: true });
  return userProfile;
};