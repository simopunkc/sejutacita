const router = require('express').Router();

const {
  readUser,
} = require('../controllers/profile.controller');

router.get('/:id', readUser);

module.exports = router;