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
import {
  findUserByIdQuery,
  addUserQuery,
  createRelationShipQuery,
  getTreeStructureQuery,
  getChildren,
  findUserByEmailQuery,
  findUserByUserNameQuery,
  findUserQuery
} from '../cypher/user.js';

import config from '../config.js';
const { cypherQuerySession } = config;

const router = express.Router();

router.post('/login', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    let { records } = await cypherQuerySession.executeQuery(
      findUserByEmailQuery(email)
    );

    const user = records[0]._fields[0];

    const foundUser = user.find(u => {
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
