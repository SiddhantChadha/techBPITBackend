const otpGenerator = require('otp-generator')

const  generateOTP = ()=>{
    const val = otpGenerator.generate(6, { lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
    return val;
}

module.exports = generateOTP;
