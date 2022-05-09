const profileDao = require('../daos/profile.dao');
const profileDaoRedis = require('../daos/profile.dao.redis');
const database = require('../models/mongodb.connection');
const databaseCache = require('../models/redis.connection');

const readUser = async (req, res) => {
  const { id } = req.params;
  try {
    const mongodbConnection = await database.getModel();
    const redisConnection = await databaseCache.getModel();
    const userProfile = await profileDaoRedis.getOneUser(mongodbConnection, redisConnection, id)
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
    const mongodbConnection = await database.getModel();
    const num = await profileDao.updateOneUser(mongodbConnection, req.body, id)
    if(num === 0){
      return res.status(404).json({
        status: false,
        message: 'user update failed',
      })
    }else{
      const redisConnection = await databaseCache.getModel();
      await profileDaoRedis.deleteOneUser(redisConnection, id);
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
    const mongodbConnection = await database.getModel();
    const num = await profileDao.deleteOneUser(mongodbConnection, id)
    if(num === 0){
      return res.status(404).json({
        status: false,
        message: 'user delete failed',
      })
    }else{
      const redisConnection = await databaseCache.getModel();
      await profileDaoRedis.deleteOneUser(redisConnection, id);
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