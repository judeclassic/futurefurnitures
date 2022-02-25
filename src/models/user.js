const mongoose = require("mongoose");

//User Schema

const User= mongoose.model("User", {
  fullName: {
    type: String,
    required: true,
  },

  phoneNumber: {
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

  emailVerified: {
    type: Boolean,
    default: false,
  },

  password: {
    type: String,
    required: true,
  },

  createDate: {
    type: Date,
    required: true,
  },

  profileImageUrl: {
    type: String,
  },

  walletID: {
    type: mongoose.Schema.ObjectId,
    ref: "Wallet",
  },

  recievedOrder: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],

  bookedOrder: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],

  pastrecievedOrder: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],
  
  pastbookedOrder: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],
  
});

module.exports = {User};
