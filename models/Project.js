const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	title: { type: String },
	image: {
		type: String,
		default: 'https://www.livetecs.com/wp-content/uploads/2019/05/Project-Management-2.png',
	},
	gitLink: { type: String },
	description: { type: String },
	hostedLink: { type: String },
	duration: { type: String },
	teamMembers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});

module.exports = projectSchema;