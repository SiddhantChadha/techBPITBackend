const User = require('../models/User')

const allUsers = async (req,res)=>{

    try{
        const userList = await User.find({isActive:true}).sort('username').select('_id email username image');
        return res.status(200).send(userList);
    }catch(err){
        return res.status(400).send({message:"Error occured"});
    }
    
}

const searchUser = async (req,res)=>{
	
	try {
		let result = await User
			.aggregate([
				{
					$search: {
						autocomplete: {
							query: req.query.search,
							path: 'username',
							fuzzy: {
								maxEdits: 2,
								prefixLength: 3,
							},
						},
					},
				},
				{
					$project:{
						_id:1,username:1,image:1
					}
				}
			]);
		
		return res.status(200).json(result)
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Error while searching"});
	}
}

module.exports = {
	allUsers,
	searchUser
}