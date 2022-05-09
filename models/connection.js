const database = require('./database')

const userLogin = require('./login.model')(database);
const userProfile = require('./profile.model')(database);

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
  database,
  userLogin,
  userProfile,
};