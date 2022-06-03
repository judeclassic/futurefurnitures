import mongoose from "mongoose";

//User Schema

const Seller= mongoose.model("Seller", mongoose.Schema({
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
  profilePic: {
    type: String,
  },
  address: {
    type: String,
  },
  verified: {
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
  cart: [{
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  }],
  savedProducts: [{
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
}));

export default Seller;