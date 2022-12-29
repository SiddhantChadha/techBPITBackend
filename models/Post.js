const mongoose = require('mongoose');
const {Schema} = mongoose;
const postType = ["eventPost","resourcePost","communityPost"];
const eventMode = ['online','offline'];
const imgURL = ["https://i.pinimg.com/originals/6a/11/63/6a11634d41f9ab6cc1a3310e9ac4d956.jpg","https://img.freepik.com/free-vector/colleagues-preparing-corporate-party-time-management-deadline-brand-event-event-brand-management-sponsored-event-organization-concept_335657-120.jpg?w=1380&t=st=1671090972~exp=1671091572~hmac=5b2b40d8351e14e6617f9abdc947117e6eafb0c3d533a0964d1a16d20f33fd95"]

const postSchema = new mongoose.Schema({
	author:{
		type: Schema.Types.ObjectId, 
        ref: 'User',
	},
	timestamp:{
        type:String,
        required:true,
    },
	postType:{
		type:String,
		required:true,
		enum:postType
	},
	groupId:{
		type:Schema.Types.ObjectId,
		required:true,
		ref:'Group'
	},
	imageUrl:{
		type:String,
		required:(isEvent || isResource),
		default:(isCommunityPost)?null:(isResource)?imgURL[0]:imgURL[1],
	},
	eventDate:{
		type:Date,
		required:isEvent
	},
	eventTime:{
		type:String,
		required:isEvent
	},
	mode:{
		type:String,
		enum:eventMode
	},
	organizer:{
		type:String,
		required:isEvent
	},
	topic:{
		type:String,
		required:(isEvent||isResource)
	},
	description:{
		type:String,
		maxLength:200,
		required:isCommunityPost
	},
	resourceTime:{
		type:String,
		required:isResource
	},
	venue:{
		type:String,
		required: (isEvent && (eventMode.indexOf(this.mode) == 1))
	},
	link:{
		type:String,
		required: (isResource || (isEvent && (eventMode.indexOf(this.mode) == 0)))
	}
	
});


function isEvent(){
	if(postType.indexOf(this.postType) == 0){
		return true;
	}
	
	return false;
}

function isResource(){
	if(postType.indexOf(this.postType) == 1){
		return true;
	}
	
	return false;
}

function isCommunityPost(){
	if(postType.indexOf(this.postType) == 2){
		return true;
	}
	
	return false;
}

module.exports = mongoose.model('Post',postSchema);