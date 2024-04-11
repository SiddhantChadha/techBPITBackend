const mongoose = require('mongoose');

const collaborationAdSchema = new mongoose.Schema({
	title: { type: String,required:true},
	createdBy:{
		type:mongoose.Types.ObjectId,
		ref:'User',
		required:true
	},
	image: {
		type: String,
		default: 'https://www.livetecs.com/wp-content/uploads/2019/05/Project-Management-2.png',
	},
	description: { type: String},
	teamSize:{
		type:Number,
	},
	skillsRequired:[{type:String}]
});

module.exports = mongoose.model('CollaborationAd', collaborationAdSchema)