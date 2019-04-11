const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Data = require('../models/data');

exports.createUser = async ( req, res, next ) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    
    if(password !== confirmPassword) {
      const error = new Error('Passwords not match!')
      error.statusCode = 422;
      throw error;
    }

    const isUserExist = await User.findOne({email: email});

    if(isUserExist) {
      const error = new Error('User with this email already exist')
      error.statusCode = 422;
      throw error;
    }
  
    const hashedPassword =  await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword
    })
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const dayCounts = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const dataObjects = [];
    let i = 0;
    while(i < dayCounts) {
      const data = new Data({
        year: year,
        month: month,
        day: i + 1,
        user: user
      })
      dataObjects.push(data);
      user.exerciseData.push(data);
      i++
    }
    await Data.insertMany(dataObjects);
    await user.save();
    res.status(201).json({ message: 'User creation success', userId: user._id})
  } catch(error) {
    next(error);
  }
}

exports.loginUser = async ( req, res, next ) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
  
    const user = await User.findOne({email: email})
    if(!user) {
      const error = new Error('Validation failed, user not found');
      error.statusCode = 422;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if(!isEqual) {
      const error = new Error('Incorrect password');
      error.statusCode = 401; 
      throw error;
    }
    const token = jwt.sign({
        email: user.email, 
        userId: user._id.toString()
      }, 
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h'}
    );
    res.status(200).json({token: token, userId: user._id.toString() })
  } catch(error) {
    next(error)
  }     
}

