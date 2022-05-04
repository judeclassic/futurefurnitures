import mongoose from "mongoose";

//User Schema

const User= mongoose.model("User", mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now(),
  },
  updateDate: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    required: true,
  },
  cart: [{
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  }],
  boughtProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  }],
  cancelledProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  }],
  deliveredProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  }],
  comments: [{
    type: mongoose.Schema.ObjectId,
    ref: "Comment",
  }],
}));

export default User;
