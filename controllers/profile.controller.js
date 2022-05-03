const profileDao = require('../models/daos/profile.dao');

const createUser = async (req, res) => {
  try {
    const userProfile = await profileDao.insertOneUser(req.body)
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

const readUser = async (req, res) => {
  const { id } = req.params
  try {
    // TBD
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

const updateUser = async (req, res) => {
  const { id } = req.params
  try {
    // TBD
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params
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
  createUser,
  readUser,
  updateUser,
  deleteUser,
}