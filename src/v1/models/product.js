import mongoose from "mongoose";

//User Schema

const Product = mongoose.model('product', mongoose.Schema({
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

  variants: [{
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: [{
      type: String,
      required: true,
    }],
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
  rating: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
  }],
  views: {
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
    type: mongoose.Schema.ObjectId,
    ref: "User",
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

export default Product;
