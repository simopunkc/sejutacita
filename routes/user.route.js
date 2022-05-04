const router = require('express').Router();

const {
  middlewareCheckRefToken,
  middlewareCheckAccToken,
  middlewareCheckIdUser,
} = require('../controllers/login.controller');

const {
  readUser,
} = require('../controllers/profile.controller');

router.get('/:id', middlewareCheckRefToken, middlewareCheckAccToken, middlewareCheckIdUser, readUser);

module.exports = router;