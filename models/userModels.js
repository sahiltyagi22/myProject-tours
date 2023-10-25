const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'please enter a valid email'],
  },

  photo: {
    type: String,
  },

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'please Enter Password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password conform doesnt match the password',
    },
  },

  passwordChangedAt: {
    type: Date,
    required: true,
  },

  passwordResetToken: {
    type: String,
  },

  passwordResetExpires: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  try {
    return await bcrypt.compare(candidatePassword, userPassword);
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.changedPasswordAfter = function (JWTts) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    console.log(changedTimeStamp, JWTts);
    return JWTts < changedTimeStamp;
  }

  // False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({resetToken});
    console.log(this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10*60*1000

    return resetToken
};

const UserModel = new mongoose.model('userModel', userSchema);

module.exports = UserModel;
