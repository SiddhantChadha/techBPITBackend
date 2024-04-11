const authRole = (role)=>{
	
	return (req,res,next)=>{
		
		if(req.user.role !== role){
			return res.status(401).json({message:"Not Allowed"})
		}
		
		next();
	}
}

module.exports = {
	authRole
}