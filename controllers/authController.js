require('dotenv').config();

const { promisify } = require('util');
const userModel = require('./../models/userModels');
const asyncError = require('./../utils/asyncError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const AppError = require('./../utils/appError');
const { emit } = require('nodemon');
const { decode } = require('punycode');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signup = asyncError(async (req, res, next) => {
  // const newUser = await userModel.create(req.body)

  const newUser = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  //    Generating token
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    data: {
      token,
      user: newUser,
    },
  });
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // console.log(email);
  // console.log(password);

  if (!email || !password) {
    return next(new AppError('please provide Email or Password', 400));
  }

  //   getting user from the DB based to login email
  const user = await userModel.findOne({ email }).select('+password');

  // Checking if email or password is incorrecr
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('invalid email or passwod', 401));
  }

  // if all okay , returning the response
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'user successfully logged in',
    token,
  });
};

//  Function to authenticate tour routes
exports.protect = asyncError(async (req, res, next) => {
  //  getting token and check it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in ', 401));
  }

  //  Verifying Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded.iat); 

  //  check if user still exists
  const freshUser = await userModel.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('User No longer exists', 401));
  }

  //  check if password changed or  not
  if(freshUser.changedPasswordAfter(decoded.iat)){
    return next (new AppError("user recently changed password.  please login again" , 401))
  }

  //  grant access to protected routes
  req.user = freshUser
  next();
});


exports.restrictTo = (...roles)=>{
  return (req,res,next)=>{
    //  roles = ['admin' , 'lead-guide]
    if(!roles.includes(req.user.role)){
      return next(new AppError('you dont now have permission to perform this action' , 403))
    }else{
      next()
    }
  }
}


exports.forgotPaaword = asyncError(async(req , res, next)=>{
//  1) get user based on posted email

      const user = await userModel.findOne({email : req.body.email})
      if(!user) {
        return next(new AppError("No user found with this email ID"))
      }

//  2) generate an random token 
      const resetToken = user.createPasswordResetToken();
      await user.save({validateBeforeSave : false})


//  3) sending it to user email
})

exports.resetPassword = (req,res)=>{
   
}