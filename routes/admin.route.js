const router = require('express').Router();

const {
  createUser,
  readUser,
  updateUser,
  deleteUser,
} = require('../controllers/profile.controller');

router.post('/store', createUser);
router.get('/:id', readUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;