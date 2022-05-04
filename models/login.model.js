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
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['username']
      },
    ],
    timestamps: false
  });
  return userLogin;
};