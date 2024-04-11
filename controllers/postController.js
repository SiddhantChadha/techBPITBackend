const mongoose = require('mongoose')
const Post = require('../models/Post.js')
const User = require('../models/User')
const { postType } = require('../config')

const createPost = async (req,res)=>{
	
	try{
	const {timestamp,postType,groupId,imageUrl,eventDate,eventTime,mode,organizer,topic,description,resourceTime,venue,link} = req.body.post;
	let post = {};
	
	post.author = mongoose.Types.ObjectId(req.user.id);
	post.timestamp = timestamp;
	post.postType = postType;
	post.groupId = groupId;
	if(imageUrl) post.imageUrl = imageUrl;
	if(eventDate) post.eventDate = eventDate;
	if(eventTime) post.eventTime = eventTime;
	if(mode) post.mode = mode;
	if(organizer) post.organizer = organizer;
	if(topic) post.topic = topic;
	if(description) post.description = description;
	if(resourceTime) post.resourceTime = resourceTime;
	if(venue) post.venue = venue;
	if(link) post.link = link;
	
		
		await Post.create(post);
		return res.status(200).json({message:"Post created Successfully"});
	}catch(err){
		console.log(err);
        return res.status(400).json({message:"Error occured"});
	}
}

const deletePost = async (req,res)=>{
	
	try{
		let post = await Post.aggregate([
								   {$match:{_id:mongoose.Types.ObjectId(req.params.postId)}},
								   {$lookup:{from: 'groups', localField: 'groupId', foreignField: '_id', as: 'groupId'}},
								   {$unwind:{path:'$groupId'}},
								   {$addFields:{"canEdit":{$in:[mongoose.Types.ObjectId(req.user.id),"$groupId.moderators"]}}},
								  ])
		
		if(post[0].canEdit){
			await Post.findByIdAndRemove(mongoose.Types.ObjectId(req.params.postId));
			return res.status(200).json({message:"Post deleted successfully"})
		}
		
		return res.status(400).json({message:"Cannot delete"});
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error occured"});
	}
}

const getAllPost = async (req,res)=>{
	
	try{
		let result = await Post.aggregate([
			{$lookup:{from: 'users', localField: 'author', foreignField: '_id', as: 'author'}},
			{$lookup:{from: 'groups', localField: 'groupId', foreignField: '_id', as: 'groupId'}},
			{$sort:{timestamp:-1}},
			{$unwind:{path:"$author"}},
			{$unwind:{path:"$groupId"}},
			{$addFields:{"canEdit":{$in:[mongoose.Types.ObjectId(req.user.id),"$groupId.moderators"]}}},
			{$unset:["author.email","author.password","author.isActive","author.skills","author.about","author.groupsJoined","author.role",
					  "author.socialLinks","author.__v","author.city","author.state","author.yearOfStudy","__v",
					   "groupId.description","groupId.moderators","groupId.usersJoined","groupId.lastMessage","groupId.__v"
					  ]}
		])
		
		return res.status(200).json(result);
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error occured"});
	}
	
}

const community = async (req,res)=>{
	
	try{
		let userDoc = await User.findById(req.user.id);
		let result = await Post.aggregate([
			{$match:{groupId:{$in:userDoc.groupsJoined}}},
			{$lookup:{from: 'users', localField: 'author', foreignField: '_id', as: 'author'}},
			{$lookup:{from: 'groups', localField: 'groupId', foreignField: '_id', as: 'groupId'}},
			{$sort:{timestamp:-1}},
			{$unwind:{path:"$author"}},
			{$unwind:{path:"$groupId"}},
			{$addFields:{"canEdit":{$in:[mongoose.Types.ObjectId(req.user.id),"$groupId.moderators"]}}},
			{$unset:["author.email","author.password","author.isActive","author.skills","author.about","author.groupsJoined","author.role",
					  "author.socialLinks","author.__v","author.city","author.state","author.yearOfStudy","__v",
					   "groupId.description","groupId.moderators","groupId.usersJoined","groupId.lastMessage","groupId.__v"
					  ]}
		])
		
		return res.status(200).json(result)
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error occured"})
	}
	
}

const eventPost = async (req,res)=>{
	
	try{
		let userDoc = await User.findById(req.user.id);
		let result = await Post.aggregate([
			{$match:{groupId:{$in:userDoc.groupsJoined},postType:"eventPost"}},
			{$lookup:{from: 'users', localField: 'author', foreignField: '_id', as: 'author'}},
			{$lookup:{from: 'groups', localField: 'groupId', foreignField: '_id', as: 'groupId'}},
			{$sort:{timestamp:-1}},
			{$unwind:{path:"$author"}},
			{$unwind:{path:"$groupId"}},
			{$addFields:{"canEdit":{$in:[mongoose.Types.ObjectId(req.user.id),"$groupId.moderators"]}}},
			{$unset:["author.email","author.password","author.isActive","author.skills","author.about","author.groupsJoined","author.role",
					  "author.socialLinks","author.__v","author.city","author.state","author.yearOfStudy","__v",
					   "groupId.description","groupId.moderators","groupId.usersJoined","groupId.lastMessage","groupId.__v"
					  ]}
		])
		
		return res.status(200).json(result);
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error occured"});
	}
}

const groupPost = async (req,res)=>{
	
	try{
		let result = await Post.aggregate([
			{$match:{groupId:mongoose.Types.ObjectId(req.params.groupId)}},
			{$lookup:{from: 'users', localField: 'author', foreignField: '_id', as: 'author'}},
			{$lookup:{from: 'groups', localField: 'groupId', foreignField: '_id', as: 'groupId'}},
			{$sort:{timestamp:-1}},
			{$unwind:{path:"$author"}},
			{$unwind:{path:"$groupId"}},
			{$addFields:{"canEdit":{$in:[mongoose.Types.ObjectId(req.user.id),"$groupId.moderators"]}}},
			{$unset:["author.email","author.password","author.isActive","author.skills","author.about","author.groupsJoined","author.role",
					  "author.socialLinks","author.__v","author.city","author.state","author.yearOfStudy","__v",
					   "groupId.description","groupId.moderators","groupId.usersJoined","groupId.lastMessage","groupId.__v"
					  ]}
		])
		
		return res.status(200).json(result);
	}catch(err){
		console.log(err);
		return res.status(400).json({message:"Error occured"});
	}
}

const updatePost = async(req,res)=>{
	try{
	const {timestamp,imageUrl,eventDate,eventTime,mode,organizer,topic,description,resourceTime,venue,link} = req.body.post;
	let updatedPost = {};
	
	updatedPost.timestamp = timestamp;
	if(imageUrl) updatedPost.imageUrl = imageUrl;
	if(eventDate) updatedPost.eventDate = eventDate;
	if(eventTime) updatedPost.eventTime = eventTime;
	if(mode) updatedPost.mode = mode;
	if(organizer) updatedPost.organizer = organizer;
	if(topic) updatedPost.topic = topic;
	if(description) updatedPost.description = description;
	if(resourceTime) updatedPost.resourceTime = resourceTime;
	if(venue) updatedPost.venue = venue;
	if(link) updatedPost.link = link;
	updatedPost.edited=true;
		
		let post = await Post.aggregate([
								   {$match:{_id:mongoose.Types.ObjectId(req.params.postId)}},
								   {$lookup:{from: 'groups', localField: 'groupId', foreignField: '_id', as: 'groupId'}},
								   {$unwind:{path:'$groupId'}},
								   {$addFields:{"canEdit":{$in:[mongoose.Types.ObjectId(req.user.id),"$groupId.moderators"]}}},
								  ])
		
		if(post[0].canEdit){
			await Post.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.postId)},updatedPost);
			return res.status(200).json({message:"Post edited successfully"})
		}
	
		
		return res.status(401).json({message:"Unauthorized action performed"});
	}catch(err){
		console.log(err);
        return res.status(400).json({message:"Error occured"});
	}
}

module.exports = {
	createPost,
	getAllPost,
	deletePost,
	community,
	eventPost,
	groupPost,
	updatePost
}