const mongoose = require('mongoose');
const roles = require('../constants/roles');

const UserSchema = mongoose.Schema(
  {
    login: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: Number,
      default: roles.USER,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
