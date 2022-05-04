const router = require('express').Router();

const {
  authUser,
  middlewareCheckRefToken,
  updateAccToken,
} = require('../controllers/login.controller');

router.post('/user', authUser);
router.get('/refresh', middlewareCheckRefToken, updateAccToken);

module.exports = router;