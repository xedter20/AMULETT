import dotenv from 'dotenv';
import assert from 'assert';

import neo4j from 'neo4j-driver';

let driver = neo4j.driver(
  'neo4j://localhost',
  neo4j.auth.basic('neo4j', 'password')
);

const serverInfo = await driver.getServerInfo();
console.log('Connection established');
console.log(serverInfo);

let cypherQuerySession = driver;

dotenv.config();

const {
  PORT,
  HOST,
  HOST_URL,
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID
} = process.env;

assert(PORT, 'Port is required');
assert(HOST, 'Host is required');

export default {
  port: PORT,
  host: HOST,
  hostUrl: HOST_URL,
  firebaseConfig: {
    apiKey: 'AIzaSyC0VFvsZIq2XFtAatvfsiiA1ZT3Vzmcf8Y',
    authDomain: 'entrep-system.firebaseapp.com',
    projectId: 'entrep-system',
    storageBucket: 'entrep-system.appspot.com',
    messagingSenderId: '454615667579',
    appId: '1:454615667579:web:e265ff3388db8e9e9823de',
    measurementId: 'G-62HCJN3SH9'
  },
  cypherQuerySession
};
