const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
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
    groupsJoined:[{ type: Schema.Types.ObjectId, ref: 'Group' }]
});

module.exports = mongoose.model('User',userSchema)