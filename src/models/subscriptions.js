const mongoose = require('mongoose');

const Subscriptions = mongoose.model("Subscription", mongoose.Schema({
    'email': {
        required: true,
        type: String,
        unique: true,
    },
    'name': {
        type: String,
    },
    'createdon': {
        type: Date,
        default: new Date
    },
}));

module.exports = {Subscriptions}