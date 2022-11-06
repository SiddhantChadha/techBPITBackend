const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD
    }
})

const sendMail = async(params)=>{
    
    try{

        await transporter.sendMail({
            from: 'techbpit@gmail.com',
            to:params.to,
            subject:'Verify your techBPIT account',
            text:'Your otp is: ' + params.otp
        });
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}

module.exports = sendMail;
