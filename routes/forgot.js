//const crypto = require('crypto');
var express    = require("express");
var bodyParser = require('body-parser');
//var sqlConn = require('../../dbConn');
//var TMClient = require('textmagic-rest-client');
var rn = require('random-number');
const nodemailer = require('nodemailer');
const multichain = require('../multichainAPI');
const helper = require('../helper/hex2str');
const TwoFactor = new(require('2factor'))('07e7bcb3-302a-11e9-8806-0200cd936042');
const hash = require('object-hash');

var app = express();
const router = express.Router();
app.use(bodyParser.json());

let sessionID;
let otp;
router.get("/",(req,res)=>{
  var gen = rn.generator({
    min:  100000
  , max:  999999
  , integer: true
  })
  
   otp = gen();
  console.log(otp);
  
  // var transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'reachus@realvariable.com',
  //     pass: 'Variable@123'
  //   }
  // });

  // var mailOptions = {
  //   from: 'reachus@realvariable.com',
  //   to:'gaurav.chibba@realvariable.com',
  //   subject: 'PASSWORD RESET TO LOGIN IN HRMS',
  //   text: 'THE OTP TO RESET THE PASSWORD IS '+otp
  // };

  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //     res.send({
  //       status:"success",
  //       data:"OTP sent to mail gaurav.chibba@realvariable.com"
  //     })
  //   }
  // });
  
  TwoFactor.sendOTP('9032276790', {otp : otp, template: "OTP to Reset HRMS Password "}).then((sessionId) => {
    console.log(sessionId);
    sessionID = sessionId;
    res.send({
            status:"success",
            data:"OTP sent to Gaurav's Phone"
          })
  }, (error) => {
    console.log(error)
  })
})

router.put('/',function(req,res){
  // console.log("req",req.body);
//   var today = new Date();
//   function encrypt(text){
//     var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
//     var crypted = cipher.update(text,'utf8','hex')
//     crypted += cipher.final('hex');
//     return crypted;
//   }
  //let encryptedString = Cryptr.encrypt(req.body.password);

  //if(otp==req.body.otp){

  // var pass={
  //   "password":req.body.password//encrypt(req.body.password)
  // }
  
  // multichain.publishStream('GAURAV','password',helper.str2hex(JSON.stringify(pass)));
  // res.send({
  //   status:"success",
  //   data:"password reset"
  // })
//}
// else{
//   res.send({
//     status:"FAIL",
//     data:"OTP is WRONG"
//   })

  TwoFactor.verifyOTP(sessionID,otp).then((response) => {
      console.log(response);
      var pass={
    "password":hash(req.body.password)//encrypt(req.body.password)
    }
  
  multichain.publishStream('GAURAV','password',helper.str2hex(JSON.stringify(pass)));
  res.send({
    status:"success",
    data:"password reset"
  })
    }, (error) => {
      console.log(error)
  res.send({
    status:"FAIL",
    data:"OTP is WRONG",
    error:error
  })

  })
//sqlConn.end();
});

module.exports=router;