const profileDao = require('../daos/profile.dao');

const readUser = async (req, res) => {
  const { id } = req.params
  try {
    const userProfile = await profileDao.getOneUser(id)
    if(userProfile.email){
      return res.status(200).json({
        status: true,
        message: 'get user profile',
        userProfile,
      })
    }else{
      return res.status(404).json({
        status: false,
        message: 'user not found',
      })
    }
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
    const num = await profileDao.updateOneUser(req.body, id)
    if(num === 0){
      return res.status(404).json({
        status: false,
        message: 'user update failed',
      })
    }else{
      return res.status(200).json({
        status: true,
        message: 'user updated',
      })
    }
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
    const num = await profileDao.deleteOneUser(id)
    if(num === 0){
      return res.status(404).json({
        status: false,
        message: 'user delete failed',
      })
    }else{
      return res.status(200).json({
        status: true,
        message: 'user deleted',
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

module.exports = {
  readUser,
  updateUser,
  deleteUser,
}