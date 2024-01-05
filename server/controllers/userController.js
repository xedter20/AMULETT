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
import profitIncrement from '../helpers/profitIncrement.js';

const { cypherQuerySession } = config;

const prepareDataBeforeInsertion = ({
  depthLevel,
  sourceIndexPosition,
  position
}) => {
  const countTotalChildrenNodes = depthLevel => {
    return 1 * Math.pow(2, depthLevel);
  };

  let childTotal = countTotalChildrenNodes(depthLevel);

  console.log({ depthLevel, sourceIndexPosition, position, childTotal });
  const createAlias = () => {
    let nextPositionIndex;
    let nextAlias = `LVL_${depthLevel + 1}`;
    if (position === 'LEFT') {
      let diff = sourceIndexPosition - 1;

      nextPositionIndex = sourceIndexPosition + diff;
      nextAlias = `${nextAlias}_INDEX_${nextPositionIndex}`;
    } else {
      let diff = sourceIndexPosition + 1 - 1;

      nextPositionIndex = sourceIndexPosition + diff;
      nextAlias = `${nextAlias}_INDEX_${nextPositionIndex}`;
    }

    return {
      nextPositionIndex,
      nextAlias
    };
  };

  const getAllPossibleMatch = ({ depthLevel }) => {
    let countLeft = 0;
    let countRight = 0;
    let childrenSize = childTotal; //EXPECTED CHILDREN IN THE DEPTH LEVEL let combinations = [];
    let combinations = [];
    let combinations_ = [];
    let combinationsGeneral_ = [];
    let generalCount = 1;

    for (let index = 0; index < childrenSize; index++) {
      let last = index + 1;
      //Linear Prediction
      if (last % 2 === 0) {
        let leftAlias = `LVL_${depthLevel + 1}_INDEX_${index}`;
        let rightAlias = `LVL_${depthLevel + 1}_INDEX_${last}`;
        combinations.push([leftAlias, rightAlias]);
        // combinations.push(index + '=' + last);
      }

      if (depthLevel > 1) {
        //Left Prediction
        if (last % 2 === 1) {
          if (countLeft % 2 === 0) {
            let leftAlias = `LVL_${depthLevel + 1}_INDEX_${last}`;
            let rightAlias = `LVL_${depthLevel + 1}_INDEX_${last + 2}`;
            // combinations_.push(last + '=' + (last + 2));
            combinations_.push([leftAlias, rightAlias]);
          }
          countLeft++;
        }

        //Right Prediction
        if (last % 2 === 0) {
          if (countLeft % 2 === 1) {
            let leftAlias = `LVL_${depthLevel + 1}_INDEX_${last}`;
            let rightAlias = `LVL_${depthLevel + 1}_INDEX_${last + 2}`;
            // combinations_.push(last + '=' + (last + 2));
            combinations_.push([leftAlias, rightAlias]);
          }

          countRight++;
        }
      }
      //Parent Prediction
      if (index < childrenSize / 2) {
        let leftAlias = `LVL_${depthLevel + 1}_INDEX_${generalCount}`;
        let rightAlias = `LVL_${depthLevel + 1}_INDEX_${
          childrenSize - childrenSize / 2 + generalCount
        }`;

        combinationsGeneral_.push([leftAlias, rightAlias]);

        // combinationsGeneral_.push(
        //   generalCount + '=' + (childrenSize - childrenSize / 2 + generalCount)
        // );
        generalCount++;
      }
    }

    // console.log('Combinations in Linear : ', combinations);
    // console.log('Combinations in Left and Right: ', combinations_);

    let allCombinations = [...combinations, ...combinations_];
    if (childrenSize / 2 > 2) {
      allCombinations = [...allCombinations, ...combinationsGeneral_];
      // console.log('Combinations in Parent', combinationsGeneral_);
    }

    return allCombinations;
  };
  // return createAlias({
  //   depthLevel: 1,
  //   sourceIndexPosition: 1,
  //   position: 'RIGHT'
  // });

  let allPossibleCombination = getAllPossibleMatch({ depthLevel });

  return {
    allPossibleCombination: allPossibleCombination,
    newlyAddedUserAlias: createAlias()
  };
};

export const createUser = async (req, res, next) => {
  try {
    const data = req.body;

    const { firstName, lastName, email } = data;

    let formData = {
      ...data,
      ID: uuidv4(),
      name: `${firstName} ${lastName}`,
      date_created: Date.now()
    };

    let position = 'RIGHT'; // // to get in UI
    let parentNodeID = '58a3a510-4905-4717-8ebe-6406e876a57e'; // to get in UI

    let { records } = await cypherQuerySession.executeQuery(
      findUserByIdQuery(parentNodeID)
    );
    const [user] = records[0]._fields[0];
    let depthLevel = user?.DEPTH_LEVEL.low || 1;
    let sourceIndexPosition = user?.INDEX_PLACEMENT.low || 1;

    if (email === 'dextermiranda441@gmail.com') {
      formData = {
        ...formData,
        role: 'ADMIN',
        isRootNode: true,
        ID_ALIAS: 'LVL_1_INDEX_1',
        INDEX_PLACEMENT: 1,
        DEPTH_LEVEL: 1
      };
    } else {
      let nodeLogicProps = prepareDataBeforeInsertion({
        depthLevel: depthLevel,
        sourceIndexPosition: sourceIndexPosition,
        position: position
      });

      formData = {
        ...formData,
        isRootNode: false,
        DEPTH_LEVEL: depthLevel + 1,
        ID_ALIAS: nodeLogicProps.newlyAddedUserAlias.nextAlias,
        INDEX_PLACEMENT: nodeLogicProps.newlyAddedUserAlias.nextPositionIndex
      };
    }

    let createdUser = await cypherQuerySession.executeQuery(
      addUserQuery({
        ...formData
      })
    );

    const result = createdUser.records[0]._fields[0];

    await cypherQuerySession.executeQuery(
      createRelationShipQuery({
        parentId: parentNodeID,
        ID: result.ID
      })
    );

    res.status(200).json({
      success: true,
      message: 'created_successfully'
    });
    return true;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    let userList = [];

    let { records } = await cypherQuerySession.executeQuery(findUserQuery());

    const users = records[0]._fields[0];

    userList = users;

    res.status(200).send(userList);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let { records } = await cypherQuerySession.executeQuery(
      findUserByIdQuery(userId)
    );

    const [user] = records[0]._fields[0];

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

    let { records } = await cypherQuerySession.executeQuery(
      findUserByEmailQuery(email)
    );

    const user = records[0]._fields[0];

    res.status(200).json({
      success: true,
      isEmailExist: !!user[0].email
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const isUserNameExist = async (req, res, next) => {
  try {
    const userName = req.body.userName;

    let { records } = await cypherQuerySession.executeQuery(
      findUserByUserNameQuery(userName)
    );

    const user = records[0]._fields[0];
    res.status(200).json({
      success: true,
      isUserNameExist: !!user[0].email
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// create user graph with parent and child relationship
export const createUsersWithGraph = async (req, res, next) => {
  try {
    let ID = uuidv4();
    // const rootUser = [
    //   {
    //     parentID: '',
    //     ID: ID,
    //     firstName: 'Dexter',
    //     lastName: 'Miranda',
    //     name: 'Dexter Miranda',
    //     rootID: '',
    //     depthLevel: 1,
    //     remarks: '',
    //     mainBranch: '',
    //     rowIndex: 0
    //   }
    // ];

    const root = {
      parentID: '',
      ID: 1,
      firstName: 'Dexter',
      lastName: 'Miranda',
      name: 'Dexter Miranda',
      rootID: '',
      depthLevel: 1,
      remarks: '',
      mainBranch: '',
      rowIndex: 0
    };

    const child1 = {
      parentID: '1',
      ID: 2,
      firstName: 'Jasmien',
      lastName: 'Miranda',
      name: 'Jasmien Miranda',
      rootID: '1',
      depthLevel: 2,
      remarks: '',
      mainBranch: 'LEFT',
      rowIndex: 0
    };

    const child2 = {
      parentID: '1',
      ID: 3,
      firstName: 'Bryan',
      lastName: 'Miranda',
      name: 'Bryan Miranda',
      rootID: '1',
      depthLevel: 2,
      remarks: '',
      mainBranch: 'RIGHT',
      rowIndex: 0
    };

    const child3 = {
      parentID: '2',
      ID: 4,
      firstName: 'Daniel',
      lastName: 'Miranda',
      name: 'Daniel Miranda',
      rootID: '1',
      depthLevel: 3,
      remarks: '',
      mainBranch: 'LEFT',
      rowIndex: 0
    };

    const user = [child3];

    await Promise.all(
      user.map(async user => {
        await cypherQuerySession.executeQuery(addUserQuery(user));
      })
    );

    await Promise.all(
      user.map(async user => {
        console.log({ user });
        if (user.parentID) {
          await cypherQuerySession.executeQuery(
            createRelationShipQuery({
              parentId: user.parentID,
              ID: user.ID
            })
          );
        }
      })
    );

    await Promise.all(
      user.map(async user => {
        if (user.parentID) {
          const { records } = await cypherQuerySession.executeQuery(
            getChildren({
              ID: user.parentID
            })
          );

          const childrenCount = records[0]._fields[0];

          console.log({ childrenCount });

          if (childrenCount.length > 1 || childrenCount.length === 2) {
            console.log('add 1k');
          } else {
            console.log('not add 1k');
          }
        }
      })
    );

    res.json({ success: true });

    // await cypherQuerySession
    //   .run(addUserQuery(user[0]))
    //   .then(({ records }) => {
    //     console.log({ records });
    //     let list = [];
    //     records.forEach(record => {
    //       list = record._fields[0];
    //     });

    //     res.json({ data: list });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // // .then(() => cypherQuerySession.close());
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getTreeStructure = async (req, res, next) => {
  try {
    const data = await cypherQuerySession.executeQuery(
      getTreeStructureQuery({
        userId: 1
      })
    );
    let result = data.records[0]._fields;

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
