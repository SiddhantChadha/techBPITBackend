const Group = require("../models/Group")
const User = require("../models/User")

const createGroup = async (req,res)=>{

    try{
        await Group.create({groupName:req.body.groupName,description:req.body.description,image:req.body.image})
        return res.status(200).send({message:"Group created Successfully"});
    }catch(err){
        return res.status(400).send({message:"Error in Creating Group"});
    }

}

const getGroups = async (req,res) =>{

    try{
        const grpList = await Group.find();
        return res.status(200).send(grpList);
    }catch(err){
        return res.status(400).send({message:"Error occured"});
    }

}

const joinGroup = async(req,res)=>{

    try{
        await User.updateOne({email:req.body.email},{
            $push:{
                groupsJoined:req.body.groupId
            }
        })
        return res.status(200).send({message:"Group joined"});
    }catch(err){
        return res.status(400).send({message:"Error occured"});
    }

}

const getJoinedGroup = async(req,res)=>{

    try{
        const grpList = await User.findOne({email:req.body.email}).populate('groupsJoined');
        return res.status(200).send(grpList);
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Error occured"});
    }
}

module.exports = {
    createGroup,
    getGroups,
    joinGroup,
    getJoinedGroup
}