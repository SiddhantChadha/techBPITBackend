const Post = require('../models/Post.js')

const createPost = async (req,res)=>{
	
	const post = req.body.post;
	
	try{
		await Post.create(post);
		return res.status(200).send({message:"Post created Successfully"});
	}catch(err){
		console.log(err);
        return res.status(400).send({message:"Error occured"});
	}
}

const getAllPost = async (req,res)=>{
	
	try{
		let result = await Post.find({}).populate({path:'author',select:'_id username image'}).populate({path:'groupId',select:'_id groupName image'}).sort({timestamp:-1});
		return res.status(200).send(result);
	}catch(err){
		console.log(err);
		return res.status(400).send({message:"Error occured"});
	}
	
}

module.exports = {
	createPost,
	getAllPost
}