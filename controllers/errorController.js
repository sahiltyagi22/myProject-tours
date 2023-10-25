// require('config')

const AppError = require('./../utils/appError')

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}; 

const sendErrorProd = (err, res) => {
  if (err.isOperational) {     
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

const handleCastErrorDB = err=>{
  const message = `Invalid ${err.path} : ${err.value}`
  return new AppError(message , 400)
}

const handleDuplicateError= (err)=>{
const value = err.errmsg.match(/({"'})(\\?.)*?\1/)

const message = `Duplicate field value : ${value}. please use another value`
}
const handleVlidationError =  err => {
  const errors = Object.values(err.errors).map(el => el.message)

const message = `Invalid Input Data . ${errors.join('. ')}`
}


const tokenError = (error)=>{
new AppError('Invalid token, please login again' , 401)
}


const tokenExpireError = (error)=>{
  return new AppError("token has expired , please login again" , 401)
}


module.exports = (err, req, res, next) => {
  // console.log(err.stack)

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err};
    if(error.name === 'CastError') error  = handleCastErrorDB(error)
    if(error.code === 11000) error = handleDuplicateError(error)
    if(error.name === 'ValidationError') error = handleVlidationError(error)
    if(error.name === 'JsonWebTokenError') error = tokenError(error)
    if(error.name === 'TokenExpiredError') error  = tokenExpireError(error)
    sendErrorProd(error, res);
  }
};
