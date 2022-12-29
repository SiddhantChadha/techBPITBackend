const Message = require('../models/Message.js')
const recentChatSchema  = require('../models/RecentChat.js')
const User = require('../models/User.js');
const mongoose = require('mongoose');

const recentPersonalChat = async (req,res)=>{
	const userId = req.body.userId;
	
	try{
		
		let result = await recentChatSchema.aggregate([{$match:{$or:[{sender:mongoose.Types.ObjectId(userId)},{receiver:mongoose.Types.ObjectId(userId)}]}},
												 {$lookup:{ from: 'users', localField: 'sender', foreignField: '_id', as: 'sender',pipeline:[{$match:{_id:{$ne:mongoose.Types.ObjectId(userId)}}}]}},
												 {$lookup:{ from: 'users', localField: 'receiver', foreignField: '_id', as: 'receiver',pipeline:[{$match:{_id:{$ne:mongoose.Types.ObjectId(userId)}}}]}},
											     {$lookup:{from:'messages',localField:'message',foreignField:'_id',as:'message'}},
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
        const grpList = await User.findOne({email:req.body.email}).populate({
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

module.exports = {
	recentPersonalChat,
	recentGroupChat
}