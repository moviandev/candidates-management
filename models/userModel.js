const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [1, 'Please provide a valid name'],
      required: [true, 'This field is needed, please fill it up']
    },
    email: {
      type: String,
      validate: [validator.isEmail, 'Please, provide a valid email'],
      index: { unique: true },
      required: true
    },
    photo: String,
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must have at least 8 characteres'],
      maxlength: [40, 'Password must have less than 40 characteres'],
      select: false
    },
    confirmPassword: {
      type: String,
      required: true,
      minlength: [8, 'Password must have at least 8 characteres'],
      maxlength: [40, 'Password must have less than 40 characteres'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords does not match'
      }
    },
    role: {
      type: String,
      enum: ['admin', 'recruiter'],
      default: 'recruiter'
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    passwordChangedAt: Date
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {
  // Checking if the passowrd has been modified
  if (!this.isModified('password')) return next();

  // Hashing the passowrd
  this.password = await bcrypt.hash(this.password, 12);

  // Passing undefined to confirmPassword to it not go to DB
  this.confirmPassword = undefined;

  // Calling next to pass to the other middleware
  next();
});

userSchema.methods.checkingPasswords = async function(cp, up) {
  return await bcrypt.compare(cp, up);
};

userSchema.methods.checkingWhenThePasswordsChanged = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
