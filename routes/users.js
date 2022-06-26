const router = require('express').Router();

const {
  getUsers, getUser, getMe, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

router.get('', getUsers);

router.get('/me', getMe);

router.get('/:userId', getUser);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
