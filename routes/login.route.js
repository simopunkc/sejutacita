const router = require('express').Router();

const {
  authUser,
} = require('../controllers/login.controller');

router.post('/login', authUser);

module.exports = router;