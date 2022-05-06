const lifetime = {
  cookie_acc_token: 30 * 60 * 1000 * 1000, // 30 minutes
  cookie_ref_token: 60 * 60 * 24 * 365 * 1000 * 1000, // 1 year
};

module.exports = {
  lifetime,
};
