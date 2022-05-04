const registerDao = require('../daos/register.dao');

const createUser = async (req, res) => {
  try {
    const userProfile = await registerDao.insertOneUser(req.body)
    return res.status(200).json({
      status: true,
      message: 'user created',
      userProfile,
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

module.exports = {
  createUser,
}