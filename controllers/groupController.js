const Group = require("../models/Group")
const User = require("../models/User")
const mongoose = require('mongoose')

const createGroup = async (req,res)=>{

    try{
        await Group.create({groupName:req.body.groupName,description:req.body.description,image:req.body.image})
        return res.status(200).send({message:"Group created Successfully"});
    }catch(err){
        return res.status(400).send({message:"Error in Creating Group"});
    }

}

const getAllGroups = async (req,res)=>{
	
	try{
		let result = await Group.find({});
		return res.status(200).json(result);
	}catch(err){
		return res.status(400).json({message:"Error occured"});
	}
}

const getGroup = async (req,res)=>{
	try{
		const grp = await Group.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.params.groupId)}},
										{$project:{"canEdit":{$in:[mongoose.Types.ObjectId(req.user.id),"$moderators"]},
												   "moderators":1,"usersJoined":1,"groupName":1,"description":1,"image":1}},
										{$project:{"canEdit":1,"usersJoined":1,"moderators":1,
												   "groupName":1,"description":1,"image":1,
												  	"isJoined":{$cond:{if:{$eq:["$canEdit",true]},then:true,
												   else:{$in:[mongoose.Types.ObjectId(req.user.id),"$usersJoined"]}}}}},   
												   
										{$lookup:{ from: 'users', localField: 'usersJoined', foreignField: '_id', as: 'usersJoined'}},
										{$lookup:{ from: 'users', localField: 'moderators', foreignField: '_id', as: 'moderators'}},
										{$project:{"groupName":1,"image":1,"description":1,"usersJoined._id":1,"usersJoined.username":1,
												   "usersJoined.image":1,"moderators._id":1,"moderators.username":1,"moderators.image":1,
												    "canEdit":1,"isJoined":1
												  }},
										  ]);
		if(grp.length==0){
			return res.status(400).json({message:"Error occured"});
		}
		return res.status(200).json(grp[0]);
	}catch(err){
		console.log(err)
		return res.status(400).json({message:"Error occured"});
	}
	
}

const groupsMentored = async (req,res)=>{
	
	try{
		let result = await Group.aggregate([
			{$match:{moderators:mongoose.Types.ObjectId(req.params.userId)}},
			{$unset:["usersJoined","moderators","lastMessage","__v","description"]}
		])
		
		return res.status(200).json(result);
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error occured"});
	}
}

const joinGroup = async(req,res)=>{

    try{
        await User.updateOne({_id:req.user.id},{
            $push:{
                groupsJoined:req.body.groupId
            }
        })

        await Group.updateOne({_id:req.body.groupId},{
            $push:{
                usersJoined:req.user.id
            }
        })

        return res.status(200).send({message:"Group joined"});
    }catch(err){
        return res.status(400).send({message:"Error occured"});
    }

}

const leaveGroup = async (req,res)=>{
	
	try{
		await User.findByIdAndUpdate(req.user.id,{$pull:{groupsJoined:req.params.groupId}})
		await Group.findByIdAndUpdate(req.params.groupId,{$pull:{usersJoined:req.user.id,moderators:req.user.id}})
		
		return res.status(200).send({message:"Left Successfully"})
	}catch(err){
		return res.status(400).send({message:"Error occured"})
	}
	
}

const deleteGroup = async (req,res)=>{
	
	try{
		return res.status(200).send({message:"This route is under maintainence"});
	}catch(err){
		return res.status(400).send({message:"Error occured"})
	}
}

const toggleModeratorAccess = async (req,res) =>{
	try{
		
		const {groupId,userId} = req.body;
	
		const grpDoc = await Group.findById(mongoose.Types.ObjectId(groupId));
		
		if(grpDoc.usersJoined.includes(mongoose.Types.ObjectId(userId))){
			await Group.updateOne({_id:grpDoc._id},
								  {$pull:{usersJoined:mongoose.Types.ObjectId(userId)}},
							
								  );
			await Group.updateOne({_id:grpDoc._id},
								  {$push:{moderators:mongoose.Types.ObjectId(userId)}} 
								  );
			
		}else if(grpDoc.moderators.includes(mongoose.Types.ObjectId(userId))){
			await Group.updateOne({_id:grpDoc._id},
								  {$pull:{moderators:mongoose.Types.ObjectId(userId)}},
								  );
			
			await Group.updateOne({_id:grpDoc._id},
								  {$push:{usersJoined:mongoose.Types.ObjectId(userId)}} 
								  );
		}else{
			return res.status(403).json({message:"User not in group"});
		}
		
		
		return res.status(200).send({message:"Access Toggled Successfully"});
	}catch(err){
		console.log(err);
		return res.status(400).send({message:"Error"});
	}
}

module.exports = {
    createGroup,
    joinGroup,
	getGroup,
	leaveGroup,
	deleteGroup,
	groupsMentored,
	getAllGroups,
	toggleModeratorAccess
}