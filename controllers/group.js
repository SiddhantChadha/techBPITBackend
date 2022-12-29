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

const getGroup = async (req,res)=>{
	
	try{
		const grp = await Group.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.params.groupId)}},
										{$lookup:{ from: 'users', localField: 'usersJoined', foreignField: '_id', as: 'usersJoined'}},
										{$lookup:{ from: 'users', localField: 'moderators', foreignField: '_id', as: 'moderators'}},
										{$project:{"groupName":1,"image":1,"description":1,"usersJoined._id":1,"usersJoined.username":1,
												   "usersJoined.image":1,"moderators._id":1,"moderators.username":1,"moderators.image":1,
												   "canEdit":{$cond:{if:{$in:[req.user,"$moderators"]},then:true,else:false}}
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

const getGroups = async (req,res) =>{

    try{
        const user = await User.findOne({_id:req.body.userId});
        const grpToJoin = await Group.find({_id:{$nin:user.groupsJoined}});
        
        return res.status(200).send(grpToJoin);
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Error occured"});
    }

}

const joinGroup = async(req,res)=>{

    try{
        await User.updateOne({_id:req.body.userId},{
            $push:{
                groupsJoined:req.body.groupId
            }
        })

        await Group.updateOne({_id:req.body.groupId},{
            $push:{
                usersJoined:req.body.userId
            }
        })

        return res.status(200).send({message:"Group joined"});
    }catch(err){
        return res.status(400).send({message:"Error occured"});
    }

}

const getJoinedGroup = async(req,res)=>{

    try{
        const grpList = await User.findOne({email:req.body.email}).populate('groupsJoined');
        return res.status(200).send(grpList);
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Error occured"});
    }
}

module.exports = {
    createGroup,
    getGroups,
    joinGroup,
    getJoinedGroup,
	getGroup
}