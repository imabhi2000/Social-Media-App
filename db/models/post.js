const mongoose = require('mongoose');
// const users = require('../models/users.js')
const Schema = mongoose.Schema;
const postschema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "public"
    },
    allowcomments: {
        type: Boolean,
        default: true
    },
    comments: [{
        commentbody: {
            type: String
        },
        commentuser: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        commentdate: {
            type: Date,
            default: Date.now
        }
    }]
})

const posts = new mongoose.model("posts", postschema);
module.exports = posts;