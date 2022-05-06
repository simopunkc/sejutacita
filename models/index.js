require('dotenv').config();
const { Sequelize } = require('sequelize');

const { env } = process;

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: env.DB_DIALECT,
  operatorsAliases: 0,
  logging: false,

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

userProfile.hasOne(userLogin, {
  as: 'user_logins',
  foreignKey: 'id_user_profiles'
})
userLogin.belongsTo(userProfile, {
  as: 'user_profiles',
  foreignKey: 'id_user_profiles',
  onDelete: 'cascade',
  hooks: true
})

module.exports = {
  Sequelize,
  sequelize,
  userLogin,
  userProfile,
};