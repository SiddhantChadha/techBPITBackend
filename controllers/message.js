const Message = require('../models/Message');

const directMessage = async (req,res)=>{
    
    const sender = req.body.sender;
    const receiver = req.body.receiver;

    try{
        let messages = await Message.find({$or:[{sender:sender,receiver:receiver},{sender:receiver,receiver:sender}]});
        messages.sort((a,b)=>a.timestamp-b.timestamp);
        return res.status(200).send(messages);
    }catch(err){
        return res.status(400).send({message:"Error occured"});
    }


}

const groupMessage = async (req,res)=>{
    
    const groupId = req.body.groupId

    try{
        let messages = await Message.find({receiver:groupId});
        messages.sort((a,b)=>a.timestamp-b.timestamp);
        return res.status(200).send(messages);
    }catch(err){
        return res.status(400).send({message:"Error occured"});
    }

}



module.exports = {
    directMessage,
    groupMessage
};