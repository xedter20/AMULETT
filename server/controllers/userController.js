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
  deleteDoc,
  query,
  where
} from 'firebase/firestore';

const db = getFirestore(firebase);
import { v4 as uuidv4 } from 'uuid';
//get get all users

export const createUser = async (req, res, next) => {
  try {
    const data = req.body;

    await addDoc(collection(db, 'users'), { ...data, id: uuidv4() });
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

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const queryUser = query(collection(db, 'users'), where('id', '==', userId));

    const querySnapshot = await getDocs(queryUser);
    let user = {};
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      user = doc.data();
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const isEmailExist = async (req, res, next) => {
  try {
    const email = req.body.email;

    const queryUser = query(
      collection(db, 'users'),
      where('email', '==', email)
    );

    const querySnapshot = await getDocs(queryUser);
    let user = {};
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      user = doc.data();
    });

    res.status(200).json({
      success: true,
      isEmailExist: !!user.email
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const isUserNameExist = async (req, res, next) => {
  try {
    const userName = req.body.userName;

    const queryUser = query(
      collection(db, 'users'),
      where('userName', '==', userName)
    );

    const querySnapshot = await getDocs(queryUser);
    let user = {};
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      user = doc.data();
    });

    res.status(200).json({
      success: true,
      isUserNameExist: !!user.email
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//
