const User = require('../models/User')

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

        const nUser = {_id:user._id,email:user.email,isActive:user.isActive,username:user.username}
        return res.status(200).send(nUser);

    }catch(err){
        return res.status(400).send({message:"Error in verifying"});
    }
}

module.exports = verify;