import mongoose from "mongoose";

const Vendor = mongoose.model("vendor", {
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    primary_service: {
        type: String,
    },
    secondary_service: {
        type: String,
    },
    crew_size: {
        type: String,
    },
    description: {
        type: String,
    },
    image: [{
        type: String,
    }],
    place_of_training: {
        type: String,
    },
    years_of_experience: {
        type: String,
    },
    license: [{
        type: String,
    }],
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "request",
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
        }
    }],
    paypal: [{
        email: String,
    }],
    payoneer: [{
        email: String,
    }]
});

export default Vendor;