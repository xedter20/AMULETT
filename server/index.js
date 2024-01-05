import express from 'express';
import cors from 'cors';

import config from './config.js';

import userRoute from './routes/userRoute.js';
import authRoute from './routes/auth.js';
import bodyParser from 'body-parser';

import profitIncrement from './helpers/profitIncrement.js';

const app = express();

// for parsing application/json
app.use(
  bodyParser.json({
    limit: '50mb'
  })
);
// for parsing application/xwww-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  })
);

app.use(cors());
app.use(express.json());

//routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

app.use('/', async (req, res, next) => {
  res.json('Hello from server');
});

app.listen(config.port, async () => {
  console.log(`Server is live @ ${config.hostUrl}`);
});
