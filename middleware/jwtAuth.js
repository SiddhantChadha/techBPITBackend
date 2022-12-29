const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
	
	const tokenHeader = req.header('Authorization');
	
	if(!tokenHeader){
		return res.status(401).send("Acess Denied");	
	}
	
	try{
		const token = tokenHeader.split(' ')[1];
		const verified = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
		req.user = verified.id;
		next();
	}catch(err){
		return res.status(401).json({message:"Invalid Token"})
	}
	
}

module.exports = {
	verifyToken
}