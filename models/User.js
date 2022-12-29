const mongoose = require('mongoose');
const { Schema } = mongoose;
const projectSchema = require('./Project.js')
const { ROLE } = require('../config.js')
const socialSchema = new Schema({platformImg:{type:String},platformLink:{type:String}})

const roleTypes = [ROLE.ADMIN,ROLE.BASIC]

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
		//unique:[true,"Email id already in use"],
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
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
        default:"https://toppng.com/public/uploads/preview/circled-user-icon-user-pro-icon-11553397069rpnu1bqqup.png"
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
	yearOfStudy:{
		type:String,
	},
	skills:[{type:String,trim:true,required:true}],
	socialLinks:{
				type:[socialSchema]
				},
    groupsJoined:[{ type: Schema.Types.ObjectId, ref: 'Group' }],
	projects:{
		type:[projectSchema],
	},
	role:{
		type:String,
		enum:roleTypes,
		required:true,
		default: ROLE.BASIC
	}
});

module.exports = mongoose.model('User',userSchema)