const lifetime = {
  cookie_acc_token: 10 * 60 * 1000, // 10 menit
  cookie_ref_token: 60 * 60 * 24 * 365 * 1000, // 1 tahun
};

module.exports = {
  lifetime,
};
