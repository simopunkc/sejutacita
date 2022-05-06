const router = require('express').Router();

const {
  middlewareCheckRefToken,
  middlewareCheckAccToken,
  middlewareValidateToken,
  middlewareCheckRole,
} = require('../controllers/login.controller');

const {
  readUser,
  updateUser,
  deleteUser,
} = require('../controllers/profile.controller');

router.get('/:id', middlewareCheckRefToken, middlewareCheckAccToken, middlewareValidateToken, middlewareCheckRole, readUser);
router.put('/:id', middlewareCheckRefToken, middlewareCheckAccToken, middlewareValidateToken, middlewareCheckRole, updateUser);
router.delete('/:id', middlewareCheckRefToken, middlewareCheckAccToken, middlewareValidateToken, middlewareCheckRole, deleteUser);

module.exports = router;