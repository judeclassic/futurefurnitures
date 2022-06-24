import mongoose from "mongoose";

const resquest = mongoose.model("service", {
    category: {
        type: String
    },
    status: {
        type: String,
    },
    photos: {
        type: String,
    },
    payment: {
        price: {
            type: String
        },
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    user: {
        name: {
            type: String
        },
        email: {
            type: String,
            required: true
        },
    },
    discription: {
        type: String,
    },
    address: {
        type: String
    },
    date: {
        type: String,
    },
    time: {
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