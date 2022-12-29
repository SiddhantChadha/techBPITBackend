const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
	userId:{
		type:mongoose.Types.ObjectId,
		ref:'User',
	},
	token:{
		type:String,
	}
});

module.exports = mongoose.model('RefreshToken',refreshTokenSchema)