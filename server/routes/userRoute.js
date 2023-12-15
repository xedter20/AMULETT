import express from 'express';

import {
  getAllUsers,
  createUser,
  getUser,
  isEmailExist,
  isUserNameExist
} from '../controllers/userController.js';

const router = express.Router();

router.get('/list', getAllUsers);
router.post('/create', createUser);
router.get('/:userId', getUser);

router.post('/isEmailExist', isEmailExist);
router.post('/isUserNameExist', isUserNameExist);

export default router;
