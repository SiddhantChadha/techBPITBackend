const mongoose = require('mongoose');

const recentChatSchema = new mongoose.Schema({
	sender:{
		type:mongoose.Types.ObjectId,
		ref:'User',
		required:true
	},
	receiver:{
		type:mongoose.Types.ObjectId,
		ref:'User',
		required:true
	},
	message:{
		type:mongoose.Types.ObjectId,
		ref:'Message',
		required:true
	}
});


module.exports = mongoose.model('RecentChat',recentChatSchema);