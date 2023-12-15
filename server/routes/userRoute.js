import express from 'express';

import {
  getAllUsers,
  createUser,
  getUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/list', getAllUsers);
router.post('/create', createUser);
router.get('/:userId', getUser);

export default router;
