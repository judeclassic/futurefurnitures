import mongoose from "mongoose";

//User Schema

const SellerProduct = mongoose.model('sellerProduct', mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: [{
    type: String,
    required: true,
  }],
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  location: {
    country: {
      type: String
    },
    state: {
      type: String
    },
    city: {
      type: String
    },
  },
  color: [{
    type: String,
    required: true,
  }],
  size: [{
    type: String,
    required: true,
  }],
  weight: {
    type: String,
    required: true,
  },
  dimensions: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  impression: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  seller: {
    type: String,
    required: true,
  },
  currectPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
}));

export default SellerProduct;
