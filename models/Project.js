const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	title: { type: String,required:true},
	createdBy:{
		type:mongoose.Types.ObjectId,
		ref:'User',
		required:true
	},
	image: {
		type: String,
		default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROA1nkRAnQd11TU_uwpvfyM9mvkcw_FsgsvQ&usqp=CAU',
	},
	gitLink: { type: String },
	description: { type: String },
	hostedLink: { type: String },
	duration: { type: String },
	teamMembers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});
module.exports = mongoose.model('Project',projectSchema);