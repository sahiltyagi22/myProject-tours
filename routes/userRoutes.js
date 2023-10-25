const express = require('express');
const authController = require('./../controllers/authController')

const router = express.Router();

const userController = require('../controllers/userController');


router.post('/signup' , authController.signup)
router.post('/login' , authController.login)

router.post('/forgotPassword' , authController.forgotPaaword)
router.post('/resetPassword' , authController.resetPassword)

router 
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.updateUser);

router
  // .route('/:id')
  // .get(userController.getUserById)
  // .post(userController.postUserById);

module.exports = router;
