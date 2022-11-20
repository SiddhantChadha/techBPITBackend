const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
    sender:{
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required:true,
    },
    receiver:{
        type: Schema.Types.ObjectId, 
        ref: 'Group', 
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    timestamp:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model('Message',messageSchema)