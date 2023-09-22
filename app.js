const express = require('express');
require('console');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
  res.status(200).send('this is the home route ');
  res.end();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// RUNNING SERVER

module.exports = app;
