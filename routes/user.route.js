const router = require('express').Router();

const {
  middlewareCheckRefToken,
  middlewareCheckAccToken,
  middlewareValidateToken,
  middlewareCheckIdUser,
} = require('../controllers/login.controller');

const {
  readUser,
} = require('../controllers/profile.controller');

router.get('/:id', middlewareCheckRefToken, middlewareCheckAccToken, middlewareValidateToken, middlewareCheckIdUser, readUser);

module.exports = router;