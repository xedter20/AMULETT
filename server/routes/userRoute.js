import express from 'express';

import {
  getAllUsers,
  createUser,
  getUser,
  isEmailExist,
  isUserNameExist,
  getTreeStructure,
  createChildren,
  getUserNodeWithChildren
} from '../controllers/userController.js';

const router = express.Router();

router.get('/list', getAllUsers);
router.post('/create', createUser);
router.get('/:userId', getUser);

router.post('/isEmailExist', isEmailExist);
router.post('/isUserNameExist', isUserNameExist);

router.post('/getTreeStructure', getTreeStructure);

router.post('/createChildren', createChildren);
router.post('/getUserNodeWithChildren', getUserNodeWithChildren);
export default router;
