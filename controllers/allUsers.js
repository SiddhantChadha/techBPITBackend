const User = require('../models/User')

const allUsers = async (req,res)=>{

    try{
        const userList = await User.find({isActive:true});
        let list = [];

        userList.forEach(function(val){
            const {_id,email,isActive,username,image} = val;
            let user = {_id,email,isActive,username,image};
            list.push(user);
        })

        return res.status(200).send(list);
    }catch(err){
        return res.status(400).send({message:"Error occured"});
    }
    
}

module.exports = allUsers;