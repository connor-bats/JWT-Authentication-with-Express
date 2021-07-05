const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    username:{
        type: String,
        required: true,
        unique: true
    },

    email:{
        type: String,
        required: true,
        unique: true

    },

    password:{
        type: String,
        required: true,
        unique: true
    },
    
    created_date:{
        type: Date,
        default: Date.now    
    }



})

module.exports = mongoose.model('Users',user)