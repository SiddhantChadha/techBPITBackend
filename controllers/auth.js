const User = require('../models/User');
const generateOTP = require('../services/otp');
const sendMail = require('../services/mail');

const signUp = async (req,res)=>{
    
    try{
        const user = await User.findOne({email:req.body.email});
        if(user && user.isActive){
            return res.status(400).send({message:"Email already in use"});
        }

        const generatedOTP = generateOTP();

        if(user && !user.isActive){
            await User.findByIdAndUpdate(user._id,{
                $set:{otp:generatedOTP}
            });

        }else{
            await User.create({email:req.body.email,password:req.body.password,otp:generatedOTP});
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

        if(user.password != req.body.password){
            return res.status(400).send({message:"Incorrect Password"});
        }

        const nUser = {_id:user._id,email:user.email,isActive:user.isActive}
        return res.status(200).send(nUser);


    }catch(err){
        return res.status(400).send({message:"Error in Login. Try again"});
    }
}

module.exports = {
    signUp,
    login
}