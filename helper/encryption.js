const crypto = require('crypto');
let algorithm = 'aes-256-ctr';
let password = "d6F3Efeq";

function encrypt(object){
    let text = JSON.stringify(object);
    text = Buffer.from(text);
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }
   
function decrypt(object){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(object,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }

module.exports ={
    encrypt:encrypt,
    decrypt:decrypt
}