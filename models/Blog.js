const mongoose = require('mongoose')


const blog = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },

    content:{
        type: String,
        required: true,
    },

   
    author:{
        type: String,
        ref: 'Users',
        required: true
    },

    created_at:{
        type: Date,
        default: Date.now
    }




})

module.exports = mongoose.model("Blogs",blog)