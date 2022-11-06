const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isActive: {
        type: Boolean,
        default: false,
      },
    otp: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('User',userSchema)