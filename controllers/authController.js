const User = require('../models/User');
const RefreshTokenSchema = require('../models/RefreshToken')
const generateOTP = require('../services/otp');
const sendMail = require('../services/mail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const signUp = async (req,res)=>{
    
    try{
		
        const user = await User.findOne({$or:[{email:req.body.email},{enrollmentNumber:req.body.enrollmentNumber}]});
		
        if(user && user.isActive){
            return res.status(400).send({message:"Email already in use"});
        }

        const generatedOTP = generateOTP();
		const hashedPassword = await bcrypt.hash(req.body.password,10);
		
        if(user && !user.isActive){
            await User.findByIdAndUpdate(user._id,{$set:{username:req.body.username,password:hashedPassword,otp:generatedOTP}});
        }else{
            await User.create({email:req.body.email,password:hashedPassword,otp:generatedOTP,username:req.body.username,enrollmentNumber:req.body.enrollmentNumber});
        }

        const mailSent = await sendMail({to:req.body.email,otp:generatedOTP});

        if(!mailSent){
            return res.status(400).send({message:"Error in Signup. Try again"});
        }

        return res.status(200).send({message:"Signup Successful"});
    }catch(err){
		console.log(err)
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
		console.log(user, validPassword);
        if(!validPassword){
            return res.status(400).send({message:"Incorrect Password"});
        }
		
		
		const access_token = jwt.sign({id:user._id,role:user.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'});
		const refresh_token = jwt.sign({id:user._id,role:user.role},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});
		
		
		const hashedToken = await bcrypt.hash(refresh_token,10);
		await RefreshTokenSchema.findOneAndUpdate({userId:user._id},{userId:user._id,token:hashedToken});
		
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

const verify = async (req,res)=>{
    const {email,otp} = req.body;
    
    try{
        const user = await User.findOne({email:email});

        if(otp!=user.otp){
            return res.status(400).send({message:"Invalid OTP.Try again"});
        }

        await User.findByIdAndUpdate(user._id,{
            $set:{isActive:true},
            $unset:{otp:""}
        })
		
		
		const access_token = jwt.sign({id:user._id,role:user.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'});
		const refresh_token = jwt.sign({id:user._id,role:user.role},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});
		
		
		const hashedToken = await bcrypt.hash(refresh_token,10);
		
		await RefreshTokenSchema.findOneAndUpdate({userId:user._id},{userId:user._id,token:hashedToken},{upsert:true});
		
        const nUser = {_id:user._id,email:user.email,isActive:true,username:user.username,access_token,refresh_token,token_type:"Bearer",
			expires_in:600,
			refresh_token_expires_in:60*60*24}
        return res.status(200).send(nUser);

    }catch(err){
        return res.status(400).send({message:"Error in verifying"});
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
		
		const access_token = jwt.sign({id:token.id,role:token.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'});
		
		return res.status(200).json({access_token,expires_in:600})
		
	}catch(err){
		return res.status(401).json({message:"Invalid Token"})
	}
	
}

module.exports = {
    signUp,
    login,
	verify,
	refresh
}