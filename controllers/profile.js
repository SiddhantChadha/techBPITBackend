const User = require('../models/User.js')

const getUser = async (req,res)=>{
	try{
		const user = await User.findByIdAndUpdate(req.params.userId)
		.populate({path:'groupsJoined', select:'groupName image description'})
		.populate({path:'projects.teamMembers' , select:'username image' })
		.select({password:0,isActive:0,__v:0});
		
		return res.status(200).json(user);
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error"});
	}
}

const updateUser = async (req,res)=>{
	const {city,state,about,yearOfStudy,socialLinks,image,skills,username} = req.body.item;
	let updateObj = {};
	
	if(city) updateObj.city = city;
	if(state) updateObj.state = state;
	if(about) updateObj.about = about;
	if(yearOfStudy) updateObj.yearOfStudy = yearOfStudy;
	if(socialLinks) updateObj.socialLinks = socialLinks;
	if(image) updateObj.image = image;
	if(username) updateObj.username = username;
	if(skills) updateObj.skills = skills;
	
	try{
		await User.findByIdAndUpdate(req.body.id,updateObj);
		return res.status(200).send({message:"Updated Successfully"});	
	}catch(err){
		console.log(err);
		return res.status(400).send({message:"Error"})
	}
}




module.exports = {
	getUser,
	updateUser
}