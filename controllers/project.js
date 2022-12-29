const User = require('../models/User.js')
const mongoose = require('mongoose')

const createProject = async (req,res)=>{
	
	const {title,image,gitLink,description,hostedLink,duration,teamMembers} = req.body;
	
	try{
		await User.findByIdAndUpdate(req.body.id,{$push:{projects:{title,image,gitLink,description,hostedLink,duration,teamMembers}}});
		return res.status(200).json({message:"Added Successfully"});
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error in creating Project"});
	}
	
}

const deleteProject = async(req,res)=>{
	
	try{
		await User.findByIdAndUpdate(req.body.id,{$pull:{projects:{_id:mongoose.Types.ObjectId(req.body.projectId)}}})
		return res.status(200).json({message:"Deleted Successfully"});
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error in deleting project"});
	}
}

module.exports={
	createProject,
	deleteProject,
}