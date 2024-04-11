const Message = require('../models/Message.js')
const recentChatSchema  = require('../models/RecentChat.js')
const User = require('../models/User.js');
const mongoose = require('mongoose');

const recentPersonalChat = async (req,res)=>{
	
	try{
		
		let result = await recentChatSchema.aggregate([{$match:{$or:[{sender:mongoose.Types.ObjectId(req.user.id)},{receiver:mongoose.Types.ObjectId(req.user.id)}]}},
												 {$lookup:{ from: 'users', localField: 'sender', foreignField: '_id', as: 'sender',pipeline:[{$match:{_id:{$ne:mongoose.Types.ObjectId(req.user.id)}}}]}},
												 {$lookup:{ from: 'users', localField: 'receiver', foreignField: '_id', as: 'receiver',pipeline:[{$match:{_id:{$ne:mongoose.Types.ObjectId(req.user.id)}}}]}},
											     {$lookup:{from:'messages',localField:'message',foreignField:'_id',as:'message'}},
												 {$sort:{"message.timestamp":-1}},
											     {$unwind:{path:'$sender',preserveNullAndEmptyArrays: true}},
											     {$unwind:{path:'$receiver',preserveNullAndEmptyArrays: true}},
												 {$unwind:{path:'$message',preserveNullAndEmptyArrays: true}},
												 {$project:{_id:{$ifNull:["$sender._id","$receiver._id"]},email:{$ifNull:["$sender.email","$receiver.email"]},
															username:{$ifNull:["$sender.username","$receiver.username"]},image:{$ifNull:["$sender.image","$receiver.image"]},
															lastMessage:"$message"}}, 
												 
												 ]);
		
		return res.status(200).send(result);
	}catch(err){
		console.log(err);
        return res.status(400).send({message:"Error occured"});
	}
}

const recentGroupChat = async ( req,res) => {
	
	try{
        const grpList = await User.findById(req.user.id).populate({
			path:'groupsJoined',
			populate:{
			path:'lastMessage',
			select:{'_id':0},
			populate:{path:'sender',select:{'_id':1,'username':1}}
			},
			select:'_id groupName image descripton'
		}).select('_id email username image');
		
        return res.status(200).send(grpList);
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Error occured"});
    }
	
}

const directMessage = async (req,res)=>{
    
    const sender = req.user.id;
    const receiver = req.params.receiver;

    try{
        let messages = await Message.aggregate([
			{$match:{$or:[{sender:mongoose.Types.ObjectId(sender),receiver:mongoose.Types.ObjectId(receiver)},
						  {sender:mongoose.Types.ObjectId(receiver),receiver:mongoose.Types.ObjectId(sender)}]}},
			{$addFields:{"isRead":{$ne:["$readAt",null]},"isSent":true}},
			{$unset:"readAt"},
			{$sort:{timestamp:-1}},
		]);
        return res.status(200).send(messages);
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Error occured"});
    }

}

const groupMessage = async (req,res)=>{

    try{
        let messages = await Message.aggregate([{$match:{receiver:mongoose.Types.ObjectId(req.params.groupId)}},
												{$addFields:{isSent:true}},
												{$lookup:{from:'users',localField:'sender',foreignField:'_id',as:'sender'}},
												{$unwind:{path:'$sender',preserveNullAndEmptyArrays: true}},
											   	{$sort:{timestamp:-1}},
												{$project:{"sender.email":0,"sender.isActive":0,"sender.password":0,
														   "sender.isBlocked":0,"sender.role":0,"sender.city":0,"sender.state":0,"sender.about":0,
														  "sender.socialLinks":0,"sender.skills":0,"sender.groupsJoined":0,"sender.enrollmentNumber":0,"sender.__v":0}}
											   ]);
        return res.status(200).send(messages);
    }catch(err){
        return res.status(400).send({message:"Error occured"});
    }

}

module.exports = {
	recentPersonalChat,
	recentGroupChat,
	directMessage,
	groupMessage
}