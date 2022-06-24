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
  location: {
    address: { 
      type: String
    },
    city: { 
      type: String
    },
    state: { 
      type: String
    },
    country: { 
      type: String
    },
    postalCode: { 
      type: String
    },
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
  savedProducts: [{
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
  shippingInformations: [{
    firstName: { 
      type: String
    },
    lastName: { 
      type: String
    },
    email: { 
      type: String
    },
    phone: { 
      type: String
    },
    address: { 
      type: String
    },
    city: { 
      type: String
    },
    state: { 
      type: String
    },
    country: { 
      type: String
    },
    postalCode: { 
      type: String
    },
  }],
  cardInfo: [{
    name: {
        type: String,
    },
    number: {
        type: String,
    },
    cvv: {
        type: String,
    },
    exp: {
        type: String
    },
    paypal: [{
      email: String,
    }],
    payoneer: [{
      email: String,
  }]
}],
}));

export default User;
