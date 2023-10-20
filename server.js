
import {createRequire} from 'module'
import DatabaseWrapper from './databaseWrapper.js'

import loginRouter from './routes/login.js';
import dashboardRouter from './routes/dashboard.js';
import tasksRouter from './routes/tasks.js';
import dealsRouter from './routes/deals.js';
import usersRouter from './routes/users.js';

const require = createRequire(import.meta.url);
const express = require('express');
const cookieParser = require('cookie-parser');
const dbInstance = new DatabaseWrapper()
const app = express();

const port = 5001;
app.use(express.json())
app.use(cookieParser())

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/api/auth/', loginRouter);
app.use('/api/dashboard/', dashboardRouter);
app.use('/api/tasks/', tasksRouter);
app.use('/api/deals/', dealsRouter);
app.use('/api/users/', usersRouter);