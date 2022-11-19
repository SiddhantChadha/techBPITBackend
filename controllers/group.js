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
        const grpsJoined = await User.find({_id:req.body.userId}).select("groupsJoined").lean();
        
        const allGrps = await Group.find({});

        const grpToJoin = allGrps.filter(x=> !grpsJoined.includes(x._id));

        return res.status(200).send(grpToJoin);
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Error occured"});
    }

}

const joinGroup = async(req,res)=>{

    try{
        await User.updateOne({_id:req.body.userId},{
            $push:{
                groupsJoined:req.body.groupId
            }
        })

        await Group.updateOne({_id:req.body.groupId},{
            $push:{
                usersJoined:req.body.userId
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