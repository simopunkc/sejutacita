const router = require('express').Router();

const {
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/profile.controller');

router.post('/store', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;