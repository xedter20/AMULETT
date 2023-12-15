import firebase from '../firebase.js';
import userModel from '../models/userModel.js';
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

const db = getFirestore(firebase);

//get get all users

export const createUser = async (req, res, next) => {
  try {
    const data = req.body;

    await addDoc(collection(db, 'users'), data);
    res.status(200).json({
      success: true,
      message: 'created_successfully'
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const userList = [];
    const queryUsers = await getDocs(collection(db, 'users'));
    queryUsers.forEach(doc => {
      userList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).send(userList);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//
