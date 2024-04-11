const mongoose = require('mongoose')
const User = require('../models/User')
const Group = require('../models/Group')
const Project = require('../models/Project')
const CollaborationAd = require('../models/CollaborationAd')
const { ROLE } = require('../config')

const globalSearch = async (req,res)=>{
	try {
		let result = await Group
			.aggregate([
				{
					$search: {
						index: "groupname",
						autocomplete: {
							query: req.query.search,
							path: 'groupName',
							fuzzy: {
								maxEdits: 2,
								prefixLength: 3,
							},
						},
					},
				},
				{
					$project:{
						_id:1,groupName:1,image:1
					}
				}
			]);
		
		return res.status(200).json(result);
		
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error"})
	}
}

const suggestProject = async (req,res)=>{
	
	try{
		const list = await Project.aggregate([{$match:{createdBy:{ $ne: mongoose.Types.ObjectId(req.user.id) }}},
										  {$sample: { size: Number(req.query.count) }},
										  {$lookup:{from:'users',localField:'createdBy',foreignField:'_id',as:'createdBy'}},
										  {$lookup:{from:'users',localField:'teamMembers',foreignField:'_id',as:'teamMembers'}},
										  {$unwind:{path:'$createdBy',preserveNullAndEmptyArrays: true}},
										  {$unwind:{path:'$teamMembers',preserveNullAndEmptyArrays: true}},
										  {$project:{"title":1,"image":1,"gitLink":1,"description":1,"hostedLink":1,"duration":1,
													 "teamMembers._id":1,"teamMembers.username":1,"teamMembers.image":1,
													  "createdBy._id":1,"createdBy.username":1,"createdBy.image":1}
										  }
										  ])
	    return res.status(200).json(list);
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error"})
	}
}

const suggestUser = async (req,res)=>{
	
	try{
		const list = await User.aggregate([{$match:{role:{ $ne: ROLE.ADMIN },_id:{ $ne: mongoose.Types.ObjectId(req.user.id) }}},
										  {$sample: { size: Number(req.query.count) }},
										   {$project:{"image":1,"username":1,"about":1}}
										  ])
	    return res.status(200).json(list);
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error"})
	}
}

const suggestGroup = async (req,res)=>{
	
	try{
		const user = await User.findOne({_id:req.user.id});
        const grpToJoin = await Group.aggregate([{$match:{_id:{$nin:user.groupsJoined}}},
												{$project:{"groupName":1,"image":1,"description":1,
														   "totalUsers":{$sum:[{$size:'$moderators'},{$size:'$usersJoined'}]}}}
												]);
        
        return res.status(200).json(grpToJoin);
	}catch(err){
		console.log(err)
		return res.status(400).json({message:"Error"})
	}
		
}

const getRelevantAds = async (req,res)=>{
	
	try{
		const user = await User.findOne({_id:req.user.id});
		
		const revelantAds = await CollaborationAd.aggregate([
												{$match:{$and:[{createdBy:{ $ne: mongoose.Types.ObjectId(req.user.id) }},
												{skillsRequired:{$in:user.skills}}]}},
												{$project:{"title":1,"image":1,"teamSize":1,
					   										"skillsRequired":1
												}}]);
		
		
		return res.status(200).json(revelantAds);
		
		
	}catch(err){
		console.log(err)
		return res.status(400).json({message:"Error"});
	}
	
}

module.exports = {
	globalSearch,
	suggestUser,
	suggestProject,
	suggestGroup,
	getRelevantAds
}