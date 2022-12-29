const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
    groupName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.seekpng.com%2Fipng%2Fu2w7e6r5t4y3a9w7_diversity-people-in-group-icon%2F&psig=AOvVaw1FJ7ARTkhTjbwdhaa0y8Xg&ust=1668437267674000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCLj456uzq_sCFQAAAAAdAAAAABAD"
    },
    description:{
        type:String
    },
	moderators:[{
		type:Schema.Types.ObjectId,
		ref:'User'
	}],
    usersJoined:[{ type: Schema.Types.ObjectId, ref: 'User' }],
	lastMessage:{
		type:Schema.Types.ObjectId,
		ref:'Message'
	}
});

module.exports = mongoose.model('Group', groupSchema)