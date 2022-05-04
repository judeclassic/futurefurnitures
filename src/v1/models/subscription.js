import mongoose from 'mongoose';

const Subscriptions = mongoose.model("Subscription",mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true,
    },
    name: {
        type: String,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    updateDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}));

export default Subscriptions;