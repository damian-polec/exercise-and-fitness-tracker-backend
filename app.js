const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const authRoutes = require('./routes/auth');
const trackerRoutes = require('./routes/tracker');
const admin = require('firebase-admin');
const helmet = require('helmet');
const SERVICE_ACCOUNT = {
  "type": process.env.SERVICE_TYPE,
  "project_id": process.env.PROJECT_ID,
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": process.env.AUTH_URI,
  "token_uri": process.env.TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
}

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT),
  storageBucket: "https://exercise-tracker-3b93d.firebaseio.com"
})
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`)
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' ||
     file.mimetype === 'image/jpg' ||
     file.mimetype === 'image/jpeg') {
       cb(null, true);
     } else {
       cb(null, false);
     }
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
  }
  next();
})
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')))

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