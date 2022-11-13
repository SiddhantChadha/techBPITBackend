const Message = require('../models/Message');

const directMessage = async (req,res)=>{
    
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;

    try{
        let messages = await Message.find({$or:[{senderId:senderId,receiverId:receiverId},{senderId:receiverId,receiverId:senderId}]});
        messages.sort((a,b)=>a-b);
        return res.status(200).send(messages);
    }catch(err){
        return res.status(400).send({message:"Error occured"});
    }


}

module.exports = directMessage;