const User = require('../models/User');
const generateOTP = require('../services/otp');
const sendMail = require('../services/mail');

const signUp = async (req,res)=>{
    
    try{
        const userExists = await User.findOne({email:req.body.email});
        if(userExists){
            return res.status(400).send({message:"Email already in use"});
        }
        const generatedOTP = generateOTP();


        await User.create({email:req.body.email,password:req.body.password,otp:generatedOTP});
        const mailSent = await sendMail({to:req.body.email,otp:generatedOTP});


        return res.status(200).send({message:"Signup Successful"});
    }catch(err){
        return res.status(400).send({message:"Error in Signup. Try again"});
    }
    
}

module.exports = signUp;