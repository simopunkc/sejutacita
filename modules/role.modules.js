function getRole(accessToken) {
  return accessToken.role;
}

function getIdUser(accessToken) {
  return accessToken.id;
}

module.exports = {
    getRole,
    getIdUser
};
