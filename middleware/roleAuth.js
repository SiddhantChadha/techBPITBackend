const User = require('../models/User')

const authRole = (role)=>{
	
	return async (req,res,next)=>{
		
		let user = await User.findById(req.user)
		
		if(user.role !== role){
			return res.status(401).json({message:"Not Allowed"})
		}
		
		next();
	}
}

module.exports = {
	authRole
}