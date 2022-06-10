const mongoose = require('mongoose');
const users = mongoose.model('users', {
    fullname: {
        type: String,
        default: " "
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        default: " "
    },
    image: {
        type: String,
        default: " "
    },
    phone: {
        type: Number,
        default: " "
    },
    location: {
        type: String,
        default: " "
    },
    fbtokens: String,
    facebook: {
        type: String
    },
    google: {
        type: String
    },
    instagram: {
        type: String
    }

});

module.exports = users;