const jwt = require('jsonwebtoken');
const RefreshTokenSchema = require('../models/RefreshToken')
const mongoose = require('mongoose');


const verifyToken = async (req,res,next)=>{
	
	const tokenHeader = req.header('Authorization');
	
	if(!tokenHeader){
		return res.status(401).send("Acess Denied");	
	}
	
	try{
		const token = tokenHeader.split(' ')[1];
		const verified = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
		let tokenDoc = await RefreshTokenSchema.findOne({userId:mongoose.Types.ObjectId(verified)})
		
		if(!tokenDoc.token){
			return res.status(401).json({message:"Invalid Token"});
		}
		
		req.user = verified;
		next();
	}catch(err){
		console.log(err);
		return res.status(401).json({message:"Invalid Token"})
	}
	
}

module.exports = {
	verifyToken
}