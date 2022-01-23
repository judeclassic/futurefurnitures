const mongoose = require("mongoose");

//User Schema

const User = mongoose.model("User", {
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    lowercase: true,
  },
  emailverified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  createdat: {
    type: Date,
    required: true,
  },
  profile_image_url: {
    type: String,
  },
  walletID: {
    type: mongoose.Schema.ObjectId,
    ref: "Wallet",
  },
  offeredorder: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],
  bookedorder: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],
  pastofferedorder: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],
  pastbookedorder: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],
  
});

module.exports = User;
