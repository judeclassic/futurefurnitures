import mongoose from 'mongoose';

const OrderModel = mongoose.model('Order' , mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    shipping: {
        firstName: { type: String},
        lastName: { type: String},
        email: { type: String},
        phone: { type: String},
        address: { type: String},
        city: { type: String},
        state: { type: String},
        country: { type: String},
        postalCode: { type: String},
    },

    
}));

        
export default OrderModel;