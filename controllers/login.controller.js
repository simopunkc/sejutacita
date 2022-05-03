const { userLogin: UserLogin } = require('../models');

const authUser = async (_, res) => {
  try {
    // TBD
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

module.exports = {
  authUser
}