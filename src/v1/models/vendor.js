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
    address: {
        type: String,
        required: true
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
    license_source: {
        type: String,
    },
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "request",
    }],
});

export default Vendor;