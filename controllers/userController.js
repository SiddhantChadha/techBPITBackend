const mongoose = require('mongoose');
const User = require('../models/User.js')
const RefreshTokenSchema = require('../models/RefreshToken')

const getUser = async (req,res)=>{
	
	try{
		
		
		const user = await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.params.userId)}},
							  {$lookup:{from:'groups',localField:'groupsJoined',foreignField:'_id',as:'groupsJoined'}},
							  {$unset:["__v","isActive","password","groupsJoined.usersJoined","groupsJoined.__v","role","groupsJoined.moderators",
									  "groupsJoined.description","groupsJoined.lastMessage"]},
							 ])
		
		let yearDiff = Number(new Date().getFullYear().toString().substr(-2)) - Number(user[0].enrollmentNumber.substr(-2));
		user[0].yearOfStudy = yearDiff;
		return res.status(200).json(user[0]);
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
		await User.findByIdAndUpdate(req.user.id,updateObj);
		return res.status(200).send({message:"Updated Successfully"});	
	}catch(err){
		console.log(err);
		return res.status(400).send({message:"Error"})
	}
}

const adminAllUsers = async (req,res)=>{

    try{
        let userList = await User.find({role:"basic"}).select('_id email username image skills isActive isBlocked enrollmentNumber').lean();
		
		userList = userList.map((item)=>{
			let yearDiff = Number(new Date().getFullYear().toString().substr(-2)) - Number(item.enrollmentNumber.substr(-2));
			item.yearOfStudy = yearDiff;
			return item;
		})
		
		
        return res.status(200).send(userList);
    }catch(err){
        return res.status(400).send({message:"Error occured"});
    }
    
}


const allUsers = async (req,res)=>{
	try{
		const userList = await User.find({isActive:true,_id:{$ne:mongoose.Types.ObjectId(req.user.id)},role:"basic"})
		.sort('username').select('_id email username image');
        return res.status(200).send(userList);
	}catch(err){
		return res.status(400).send({message:"Error occured"});
	}
}


const searchUser = async (req,res)=>{
	
	try {
		let result = await User
			.aggregate([
				{
					$search: {
						index: "username",
						autocomplete: {
							query: req.query.search,
							path: 'username',
							fuzzy: {
								maxEdits: 2,
								prefixLength: 3,
							},
						},
						filter:[{
							equals: {
								value:"basic",
								path:"role"
							}
						}]
					},
				},
				{
					$project:{
						_id:1,username:1,image:1
					}
				}
			]);
		
		return res.status(200).json(result)
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Error while searching"});
	}
}


const deleteUser = async (req,res)=>{
	
	const userId = req.params.userId;
	try{
		await RefreshTokenSchema.deleteOne({userId:userId});
		await User.findByIdAndUpdate(userId,{isBlocked:true});
		return res.status(200).json({message:"Deleted successfully"});
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error"});
	}
	
}


const unblockUser = async (req,res)=>{
	
	const userId = req.params.userId;
	try{
		await User.findByIdAndUpdate(userId,{isBlocked:false,isActive:false});
		return res.status(200).json({message:"Unblocked successfully"});
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error"});
	}
}


module.exports = {
	getUser,
	updateUser,
	allUsers,
	searchUser,
	deleteUser,
	unblockUser,
	adminAllUsers
}