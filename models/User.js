const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ROLE } = require('../config.js')
const socialSchema = new Schema({platformImg:{type:String},platformLink:{type:String}})

const roleTypes = [ROLE.ADMIN,ROLE.BASIC]

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
		index:true
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        required: true,
    },
    image:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
    },
	city:{
		type:String
	},
	state:{
		type:String,
	},
	about:{
		type:String
	},
	enrollmentNumber:{
		type:String,
		minLength:11,
		maxLength:11,
		required:true
	},
	skills:[{type:String,trim:true,required:true}],
	socialLinks:{
				type:[socialSchema]
				},
    groupsJoined:[{ type: Schema.Types.ObjectId, ref: 'Group' }],
	role:{
		type:String,
		enum:roleTypes,
		required:true,
		default: ROLE.BASIC
	},
	isBlocked: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('User',userSchema)