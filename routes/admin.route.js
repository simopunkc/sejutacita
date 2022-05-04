const router = require('express').Router();

const {
  middlewareCheckRefToken,
  middlewareCheckAccToken,
  middlewareCheckRole,
} = require('../controllers/login.controller');

const {
  readUser,
  updateUser,
  deleteUser,
} = require('../controllers/profile.controller');

router.get('/:id', middlewareCheckRefToken, middlewareCheckAccToken, middlewareCheckRole, readUser);
router.put('/:id', middlewareCheckRefToken, middlewareCheckAccToken, middlewareCheckRole, updateUser);
router.delete('/:id', middlewareCheckRefToken, middlewareCheckAccToken, middlewareCheckRole, deleteUser);

module.exports = router;