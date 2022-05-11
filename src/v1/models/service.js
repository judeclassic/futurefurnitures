import mongoose from "mongoose";

const resquest = mongoose.model("service", {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    discription: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

export default resquest;