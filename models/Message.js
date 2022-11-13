const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    senderId:{
        type:String,
        required:true,
    },
    receiverId:{
        type:String,
        required:true,
    },
    messageBody:{
        type:String,
        required:true,
    },
    timestamp:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model('Message',userSchema)