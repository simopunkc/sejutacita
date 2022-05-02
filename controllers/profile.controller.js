const { profile: Profile } = require('../models');

const createUser = async (req, res) => {
  try {
    // TBD
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

const readUser = async (_, res) => {
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