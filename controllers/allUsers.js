const User = require('../models/User')

const allUsers = async (req,res)=>{

    const userList = await User.find({});

    let list = [];

    userList.forEach(function(val){
        const {_id,email,isActive} = val;
        let user = {_id,email,isActive};
        list.push(user);
    })

    res.status(200).send(list);

}

module.exports = allUsers;