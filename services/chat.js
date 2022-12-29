const messageSchema = require('../models/Message.js');
const groupSchema = require('../models/Group.js');
const userSchema = require('../models/User.js');
const recentChatSchema = require('../models/RecentChat.js');
const mongoose = require('mongoose');

const start  = (io)=>{
	io.on('connection', (socket) => {
    const user = socket.handshake.query.userId;
    console.log(user + ' connected');
    socket.join(user);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
    })

    socket.on('msg', async (msg, receiver, callback) => {

        try{
            let receivedMsg = await messageSchema.create({msgType:msg.type,sender:msg.sender,receiver:msg.receiver,message:msg.message,timestamp:msg.timestamp,imageUrl:msg.imageUrl});
			
			await recentChatSchema.findOneAndUpdate(
				{$or:[{sender:mongoose.Types.ObjectId(msg.sender),receiver:mongoose.Types.ObjectId(msg.receiver)},
					  {sender:mongoose.Types.ObjectId(msg.receiver),receiver:mongoose.Types.ObjectId(msg.sender)}
					 ]},
					{sender:msg.sender,receiver:msg.receiver,message:receivedMsg._id},{upsert:true});
			
			
            console.log("message being emitted :" + msg.message);
			console.log(msg.sender+"-msg");
            socket.to(receiver).emit(msg.sender +"-msg", msg);
            
            callback({
                status: "message delivered"
            });

        }catch(err){
            console.log(err);
            callback({
                status: "message not delivered"
            });
        }

    });

    socket.on('grp-msg', async (msg, receiver, callback) => {

        try{
            let  receivedMsg = await messageSchema.create({msgType:msg.type,sender:msg.sender,receiver:msg.receiver,message:msg.message,timestamp:msg.timestamp,imageUrl:msg.imageUrl});
			await groupSchema.findByIdAndUpdate(receiver,{lastMessage:receivedMsg._id});
            socket.to(receiver).emit(receiver + "-msg", msg);

            callback({
                status: "message delivered"
            });
            
        }catch(err){
            console.log(err);
            callback({
                status: "message not delivered"
            });
        }

    });
		
	socket.on('isTyping',(sender,receiver,status,isGrpChat,senderName)=>{
		
		if(isGrpChat){
			socket.to(receiver).emit(receiver+"-isTyping",{senderName,status})
		}else{
			socket.to(receiver).emit(sender+"-isTyping",{status})	
		}
		
	})
		
	socket.on('read-status',async(sender,receiver,timestamp)=>{
		let result = await messageSchema.updateMany({sender:mongoose.Types.ObjectId(sender),receiver:mongoose.Types.ObjectId(receiver),readAt:null},
									   {readAt:timestamp})
	    console.log(result);
		
	})

    socket.on('disconnect',(reason)=>{
        console.log(user + " disconnected. Reason - " + reason);
        socket.leave(user);
    })

})

}

module.exports = {
	start
}
