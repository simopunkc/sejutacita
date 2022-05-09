require('dotenv').config();
const jwt = require('../modules/jwt.modules');
const token = require('../modules/token.modules');
const role = require('../modules/role.modules');
const loginDao = require('../daos/login.dao');
const database = require('../models/mongodb.connection');

const { env } = process;

const middlewareCheckRefToken = async (req, res, next) => {
  try {
    if(req.headers[env.COOKIE_REFRESH_TOKEN]){
      const refToken = jwt.decryptJWT(req.headers[env.COOKIE_REFRESH_TOKEN])
      if(token.isExpiredRefToken(refToken.expired)){
        return res.status(400).json({
          status: false,
          message: 'refresh token expired',
        })
      }else{
        res.locals.refToken = refToken
        next()
      }
    }else{
      return res.status(400).json({
        status: false,
        message: 'refresh token not found',
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

const middlewareCheckAccToken = async (req, res, next) => {
  try {
    if(req.headers[env.COOKIE_ACCESS_TOKEN]){
      const accToken = jwt.decryptJWT(req.headers[env.COOKIE_ACCESS_TOKEN])
      if(token.isExpiredAccToken(accToken.expired)){
        return res.status(400).json({
          status: false,
          message: 'access token expired',
        })
      }else{
        res.locals.accToken = accToken
        next()
      }
    }else{
      return res.status(400).json({
        status: false,
        message: 'access token not found',
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

const middlewareValidateToken = async (_, res, next) => {
  try {
    const validToken = token.validateIdToken(res.locals.refToken,res.locals.accToken)
    if(validToken){
      next()
    }else{
      return res.status(400).json({
        status: false,
        message: "refresh token and access token don't match",
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

const middlewareCheckRole = async (_, res, next) => {
  try {
    const validateRole = role.getRole(res.locals.accToken)
    if(validateRole!=1){
      return res.status(403).json({
        status: false,
        message: 'invalid authorization',
      })
    }else{
      next()
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

const middlewareCheckIdUser = async (req, res, next) => {
  try {
    const idUser = role.getIdUser(res.locals.accToken)
    if(idUser!=req.params.id){
      return res.status(403).json({
        status: false,
        message: 'invalid user authorization',
      })
    }else{
      next()
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

const authUser = async (req, res) => {
  try {
    const mongodbConnection = await database.getModel();
    const userLogin = await loginDao.authUser(mongodbConnection, req.body)
    if(userLogin.accToken){
      return res.status(200).json({
        status: true,
        message: 'generate token user',
        userLogin,
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

const updateAccToken = async (req, res) => {
  try {
    const userLogin = await loginDao.updateAccToken(res.locals.refToken)
    if(userLogin.accToken){
      return res.status(200).json({
        status: true,
        message: 'get access token',
        userLogin,
      })
    }else{
      return res.status(404).json({
        status: false,
        message: 'invalid access token',
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
  middlewareCheckRefToken,
  middlewareCheckAccToken,
  middlewareValidateToken,
  middlewareCheckRole,
  middlewareCheckIdUser,
  authUser,
  updateAccToken,
}