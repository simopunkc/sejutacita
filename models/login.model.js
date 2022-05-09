module.exports = (database) => {
  const userLogin = database.sequelize.define('user_logins', {
    id_user_profiles: {
      type: database.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: database.Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: database.Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: database.Sequelize.INTEGER,
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