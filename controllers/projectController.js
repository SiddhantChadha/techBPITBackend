const Project = require('../models/Project')
const mongoose = require('mongoose')

const createProject = async (req,res)=>{
	
	const {title,image,gitLink,description,hostedLink,duration,teamMembers} = req.body;
	
	try{
		await Project.create({title,gitLink,image,description,hostedLink,duration,teamMembers,createdBy:mongoose.Types.ObjectId(req.user.id)});
		return res.status(200).json({message:"Project Added Successfully"});
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error in creating Project"});
	}
	
}

const getProject = async (req,res)=>{
	try{
		const result = await Project.aggregate([
			{$match:{_id:mongoose.Types.ObjectId(req.params.projectId)}},
			{$lookup:{from:'users',localField:'createdBy',foreignField:'_id',as:'createdBy'}},
			{$lookup:{from:'users',localField:'teamMembers',foreignField:'_id',as:'teamMembers'}},
			{$unwind:{path:'$createdBy',preserveNullAndEmptyArrays: true}},
			{$project:{"title":1,"image":1,"gitLink":1,"description":1,"hostedLink":1,"duration":1,
													 "teamMembers._id":1,"teamMembers.username":1,"teamMembers.image":1,
													  "createdBy._id":1,"createdBy.username":1,"createdBy.image":1
												}}
			
		]);
		
		if(result.length == 0){
			return res.status(200).json({message:"no project found"})
		}
		
		return res.status(200).json(result[0]);
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"error"});
	}
}

const getProjects = async (req,res)=>{
	
	
	try{
		let projects = await Project.aggregate([{$match:{createdBy:mongoose.Types.ObjectId(req.params.userId)}},
											   	{$lookup:{from:'users',localField:'createdBy',foreignField:'_id',as:'createdBy'}},
												{$lookup:{from:'users',localField:'teamMembers',foreignField:'_id',as:'teamMembers'}},
										  		{$unwind:{path:'$createdBy',preserveNullAndEmptyArrays: true}},
										  		
										  		{$project:{"title":1,"image":1,"gitLink":1,"description":1,"hostedLink":1,"duration":1,
													 "teamMembers._id":1,"teamMembers.username":1,"teamMembers.image":1,
													  "createdBy._id":1,"createdBy.username":1,"createdBy.image":1
												}}
											   ])
		return res.status(200).json(projects)
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error"});
	}
}

const updateProject = async (req,res)=>{
	
	const {title,image,gitLink,description,hostedLink,duration,teamMembers} = req.body;
	let updateObj = {}
	
	if(title) updateObj.title = title;
	if(image) updateObj.image = image;
	if(gitLink) updateObj.gitLink = gitLink;
	if(description) updateObj.description = description;
	if(hostedLink) updateObj.hostedLink = hostedLink;
	if(duration) updateObj.duration = duration;
	if(teamMembers) updateObj.teamMembers = teamMembers;
	
	try{
		await Project.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.projectId),createdBy:mongoose.Types.ObjectId(req.user.id)},updateObj);
		return res.status(200).json({message:"Project Updated Sucessfully"});
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error"});
	}
}

const deleteProject = async(req,res)=>{
	
	try{
		await Project.findOneAndDelete({_id:mongoose.Types.ObjectId(req.params.projectId),createdBy:mongoose.Types.ObjectId(req.user.id)});
		return res.status(200).json({message:"Deleted Successfully"});
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error in deleting project"});
	}
}

module.exports={
	createProject,
	getProjects,
	deleteProject,
	updateProject,
	getProject
}