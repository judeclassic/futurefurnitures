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
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
  },
  brand: {
    type: String,
  },
  color: [{
    type: String,
  }],
  size: [{
    type: String,
  }],
  weight: {
    type: String,
  },
  dimensions: {
    type: String,
  },
  discount: {
    type: Number,
  },
  rating: {
    average: {
      type: Number,
      default: 3,
    },
    from: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
    }],
  },
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
  },
  status: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
  },
  isVerified: {
    type: Boolean,
  },
  isActive: {
    type: Boolean,
  },
}));

export default Product;
