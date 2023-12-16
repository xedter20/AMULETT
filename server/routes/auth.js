import express from 'express';

import { getAllUsers, createUser } from '../controllers/userController.js';
import firebase from '../firebase.js';
const db = getFirestore(firebase);
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

import userModel from '../models/userModel.js';

const router = express.Router();

const staticUsers = [
  { email: 'dextermiranda441@gmail.com', password: 'Password1' },
  { email: 'admin@gmail.com', password: 'Password1' }
];

router.post('/login', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const userList = [];

  try {
    const queryUsers = await getDocs(collection(db, 'users'));
    queryUsers.forEach(doc => {
      userList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    const foundUser = userList.find(u => {
      return u.email === email && u.password === password;
    });

    if (foundUser) {
      res.json({
        success: true,
        token: 'token_should_be_initialize_here',
        data: {
          role: foundUser.role,
          id: foundUser.id,
          email: foundUser.email
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'wrong_credentials'
      });
    }
  } catch (error) {
    return res.status(500).send('Something went wrong');
  }
});

export default router;
