require('dotenv').config();
const loginDao = require('../daos/login.dao');

const { env } = process;

const middlewareCheckRefToken = async (req, res, next) => {
  try {
    if(req.headers[env.COOKIE_REFRESH_TOKEN]){
      const refToken = loginDao.jwt.decryptJWT(req.headers[env.COOKIE_REFRESH_TOKEN])
      if(loginDao.token.isExpiredRefToken(refToken.expired)){
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
      const accToken = loginDao.jwt.decryptJWT(req.headers[env.COOKIE_ACCESS_TOKEN])
      if(loginDao.token.isExpiredAccToken(accToken.expired)){
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

const middlewareCheckRole = async (req, res, next) => {
  try {
    const role = loginDao.role.getRole(res.locals.accToken)
    if(role!=1){
      return res.status(400).json({
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
    const idUser = loginDao.role.getIdUser(res.locals.accToken)
    if(idUser!=req.params.id){
      return res.status(400).json({
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
    const userLogin = await loginDao.authUser(req.body)
    if(userLogin.accToken){
      return res.status(200).json({
        status: true,
        message: 'get token user',
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
  middlewareCheckRole,
  middlewareCheckIdUser,
  authUser,
  updateAccToken,
}