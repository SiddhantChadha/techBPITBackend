const CollaborationAd = require('../models/CollaborationAd')
const mongoose = require('mongoose')

const createAd = async (req,res)=>{

	const {title,image,description,teamSize,skillsRequired} = req.body;
	
	try{
		await CollaborationAd.create({title,image,description,teamSize,skillsRequired,createdBy:mongoose.Types.ObjectId(req.user.id)});
		return res.status(200).json({message:"Ad created Successfully"});
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error in creating Ad"});
	}
	
}

const getAllAds = async (req,res)=>{
		
	try{
		let ads = await CollaborationAd.aggregate([{$match:{createdBy:mongoose.Types.ObjectId(req.params.userId)}},
											   	{$lookup:{from:'users',localField:'createdBy',foreignField:'_id',as:'createdBy'}},
										  		{$unwind:{path:'$createdBy',preserveNullAndEmptyArrays: true}},
										  		{$project:{"title":1,"image":1,"description":1,"teamSize":1,"skillsRequired":1,
					   										"createdBy._id":1,"createdBy.username":1,"createdBy.image":1
												}}
											   ])
		return res.status(200).json(ads);
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error"});
	}
}

const getAd = async (req,res)=>{
	try{
		const result = await CollaborationAd.aggregate([
			{$match:{_id:mongoose.Types.ObjectId(req.params.adId)}},
			{$lookup:{from:'users',localField:'createdBy',foreignField:'_id',as:'createdBy'}},
			{$unwind:{path:'$createdBy',preserveNullAndEmptyArrays: true}},
			{$project:{"title":1,"image":1,"description":1,"teamSize":1,"skillsRequired":1,
					   "createdBy._id":1,"createdBy.username":1,"createdBy.image":1
												}}
			
		]);
		
		if(result.length == 0){
			return res.status(200).json({message:"no ad found"})
		}
		
		return res.status(200).json(result[0]);
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"error"});
	}
}


const deleteAd = async (req,res)=>{
	try{
		await CollaborationAd.findOneAndDelete({_id:mongoose.Types.ObjectId(req.params.adId),createdBy:mongoose.Types.ObjectId(req.user.id)});
		return res.status(200).json({message:"Deleted Successfully"});
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error in deleting project"});
	}
}


const updateAd = async (req,res)=>{
	
	const {title,image,description,skillsRequired,teamSize} = req.body;
	let updateObj = {}
	
	if(title) updateObj.title = title;
	if(image) updateObj.image = image;
	if(description) updateObj.description = description;
	if(skillsRequired) updateObj.skillsRequired = skillsRequired;
	if(teamSize) updateObj.teamSize = teamSize;
	
	try{
		await CollaborationAd.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.adId),createdBy:mongoose.Types.ObjectId(req.user.id)},updateObj);
		return res.status(200).json({message:"Collaboration Project Updated Sucessfully"});
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error"});
	}
}


module.exports = {
	createAd,
	getAd,
	getAllAds,
	deleteAd,
	updateAd
}