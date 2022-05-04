const router = require('express').Router();

const {
  createUser,
} = require('../controllers/register.controller');

router.post('/user', createUser);

module.exports = router;