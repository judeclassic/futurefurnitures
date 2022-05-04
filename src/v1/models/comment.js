import mongoose from "mongoose";


//Comment Schema
const Comment = mongoose.model("Comment", mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
    },
    comment: {
        type: String,
        required: true,
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
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
}));

export default Comment;


