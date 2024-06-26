const mongoose = require('mongoose');
const { Schema } = mongoose;
const msgTypes = ["direct-message","group-message","direct-message-with-image","group-message-with-image"];
const userRef = ["direct-message","direct-message-with-image"];
const imageRef = ["direct-message-with-image","group-message-with-image"]
const refTypes = ["User","Group"];

const messageSchema = new mongoose.Schema({
    msgType:{
        type:String,
        enum:msgTypes,
        required:true,
    },
    sender:{
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required:true,
    },
    receiver:{
        type: Schema.Types.ObjectId, 
        ref: checkRef, 
        required:true,
    },
    message:{
        type:String,
        required:function(){
			return !checkImg(this.msgType)
		},
    },
    timestamp:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required: function(){
			return checkImg(this.msgType)
		}
    },
	readBy:{
		type:Map,
		of:String,
	},
	readAt:{
		type:String,
        default:null,
	}
});

function checkRef(){
    if(userRef.indexOf(this.msgType) > -1){
        return refTypes[0];
    }

    return refTypes[1];
}


function checkImg(){
    if(imageRef.indexOf(this.msgType) > -1){
        return true;
    }

    return false;
}

module.exports = mongoose.model('Message',messageSchema)