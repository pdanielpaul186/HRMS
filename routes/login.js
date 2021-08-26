const multichain=require('../multichainAPI');
const express = require('express');
const bodyparser=require('body-parser');
const helper = require('../helper/hex2str');
const hash = require('object-hash');

//middleware 
const app = express();
const router = express.Router();
//let body=bodyparser();

//body parser
app.use( bodyparser.json() );  

router.post('/',(req,res)=>{
    //let name=req.body.name;
    let  passwd = hash(req.body.password);
    let arr=[];
    let loginData =[];
    users();
    async function users(){
        try {
            if(req.body.name=='GAURAV'){
            let rawData = await multichain.fetchData('GAURAV','password');
            //console.log('data ',rawData);
          
            
            
                let hex = await helper.hex2str(rawData[0].data);
                //console.log(Data1);
               let jparsed= JSON.parse(hex);
                //console.log(Data1);
                loginData.push(jparsed);

            
        
       
            if(passwd==loginData[0].password){
                arr.push({
                    status:"Success",
                    message:"LOGIN SUCCESSFULL"
                })
            }
            else{
               arr.push({
                   status:"fail",
                   message:"PASSWORD INCORRECT"
               }) 
        
        }

    }
    else{
        arr.push({
            status:"fail",
                   message:"USERNAME INCORRECT"
        })
    }
      res.send({
          data:arr
      })
    }
    catch(error){
        console.log(error);
    }
    }
    
})

module.exports=router;