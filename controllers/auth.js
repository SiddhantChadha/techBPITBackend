const User = require('../models/User');
const RefreshTokenSchema = require('../models/RefreshToken')
const generateOTP = require('../services/otp');
const sendMail = require('../services/mail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const signUp = async (req,res)=>{
    
    try{
        const user = await User.findOne({email:req.body.email});
        if(user && user.isActive){
            return res.status(400).send({message:"Email already in use"});
        }

        const generatedOTP = generateOTP();
		const hashedPassword = await bcrypt.hash(req.body.password,10);
		
        if(user && !user.isActive){
            await User.findByIdAndUpdate(user._id,{$set:{username:req.body.username,password:hashedPassword,otp:generatedOTP}});
        }else{
            await User.create({email:req.body.email,password:hashedPassword,otp:generatedOTP,username:req.body.username});
        }

        const mailSent = await sendMail({to:req.body.email,otp:generatedOTP});

        if(!mailSent){
            return res.status(400).send({message:"Error in Signup. Try again"});
        }

        return res.status(200).send({message:"Signup Successful"});
    }catch(err){
        return res.status(400).send({message:"Error in Signup. Try again"});
    }
    
}

const login = async(req,res)=>{

    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(400).send({message:"Email not found"});
        }

        if(!user.isActive){
            return res.status(400).send({message:"OTP not verified"});
        }

        const validPassword = await bcrypt.compare(req.body.password,user.password)

        if(!validPassword){
            return res.status(400).send({message:"Incorrect Password"});
        }
		
		
		const access_token = jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10m'});
		const refresh_token = jwt.sign({id:user._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});
		
		
		const hashedToken = await bcrypt.hash(refresh_token,10);
		await RefreshTokenSchema.findOneAndUpdate({userId:user._id},{userId:user._id,token:hashedToken},{upsert:true});
		
		const userObj = {
			_id:user._id,email:user.email,username:user.username,isActive:user.isActive,
			image:user.image,
			access_token,refresh_token,token_type:"Bearer",
			expires_in:600,
			refresh_token_expires_in:60*60*24
		}
		
        return res.status(200).json(userObj);


    }catch(err){
		console.log(err);
        return res.status(400).send({message:"Error in Login. Try again"});
    }
}

const refresh = async(req,res)=>{
	
	const refresh_token = req.body.refresh_token;
	
	try{
		const token = jwt.verify(refresh_token,process.env.REFRESH_TOKEN_SECRET);
		let tokenDoc = await RefreshTokenSchema.findOne({userId:mongoose.Types.ObjectId(token.id)})
		
		const validToken = await bcrypt.compare(refresh_token,tokenDoc.token)

        if(!validToken){
            return res.status(401).json({message:"Invalid Token"});
        }
		
		const access_token = jwt.sign({id:token.id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10m'});
		
		return res.status(200).json({access_token,expires_in:600})
		
	}catch(err){
		return res.status(401).json({message:"Invalid Token"})
	}
	
}

module.exports = {
    signUp,
    login,
	refresh
}