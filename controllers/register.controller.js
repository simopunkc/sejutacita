const registerDao = require('../daos/register.dao');
const database = require('../models/mongodb.connection');

const createUser = async (req, res) => {
  try {
    const mongodbConnection = await database.getModel();
    const userProfile = await registerDao.insertOneUser(mongodbConnection, req.body)
    if(userProfile.email){  
      return res.status(201).json({
        status: true,
        message: 'user created',
        userProfile,
      })
    }else{
      return res.status(400).json({
        status: false,
        message: 'used registration failed',
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
  createUser,
}