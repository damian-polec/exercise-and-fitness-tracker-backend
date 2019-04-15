const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const trackerRoutes = require('./routes/tracker');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
  }
  next();
})

app.use('/auth', authRoutes);
app.use('/tracker', trackerRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({message: message, errors: error});
})

mongoose
  .connect(`mongodb+srv://${process.env.USER}:${process.env.SECRET_PASS}@exercise-tracker-gnxf7.mongodb.net/exerciseTracker?retryWrites=true`, { useNewUrlParser: true })
  .then(res => {
    app.listen(process.env.PORT || 8080);
  })
  .catch(err => console.log(err));