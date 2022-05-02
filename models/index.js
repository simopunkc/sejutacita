const { Sequelize } = require('sequelize');

const { env } = process;

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: env.DB_DIALECT,
  operatorsAliases: 0,

  pool: {
    max: 3,
    min: 1,
    acquire: env.DB_ACQUIRE_POOL,
    idle: env.DB_IDLE_POOL,
  },
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false
  //   }
  // }
});

const userLogin = require('./login.model')(sequelize, Sequelize);
const userProfile = require('./profile.model')(sequelize, Sequelize);

userProfile.belongsTo(userLogin, {
  as: 'user_login',
  foreignKey: 'id_user_login'
})

module.exports = {
  Sequelize,
  sequelize,
  userLogin,
  userProfile,
};