const multichain=require('../multichainAPI');
const helper=require("../helper/hex2str");
const express = require('express');
const bodyParser = require('body-parser');
//const CRYPTR = require('cryptr');
const encryptor = require('../helper/encryption');
const hex2str = require('../helper/stingtoHex');

//middleware 
//const cryptr = new CRYPTR('paySlip_Details');
const app = express();
const router = express.Router();
//let body=bodyParser();

//body parser
app.use( bodyParser.json() );       


router.post('/',(req,res)=>{
    let arr=[];
    users();
async function users(){
    try{
        
        let psData=[];

        //getting payslip details
        // var d = new Date();
        // var month = new Array();
        // month[0] = "January";
        // month[1] = "February";
        // month[2] = "March";
        // month[3] = "April";
        // month[4] = "May";
        // month[5] = "June";
        // month[6] = "July";
        // month[7] = "August";
        // month[8] = "September";
        // month[9] = "October";
        // month[10] = "November";
        // month[11] = "December";
        console.log(req.body)
        let id=req.body.empid;
        console.log(id)
        var n = req.body.month;
        //console.log(n);
        var year=req.body.year;
        // console.log(year);
         //let year=a.getFullYear;
        let PS='PS'+''+n+''+year;
        let jparse; 
        let listStreams =await multichain.listStreams();
        //console.log(listStreams);
        
        for(var i=0;i<listStreams.length;i++){
        rawData = await multichain.fetchData(listStreams[i].name,PS);
        //console.log('data ',rawData);
      
        
        for(var n=0;n<rawData.length;n++)
        {
            let raw = await hex2str.stringToHex(rawData[n].data);
            //console.log(raw);
            // var decryptPayslipDetails = encryptor.decrypt(raw);
            // console.log(decryptPayslipDetails);
            // decryptPayslipDetails  = JSON.stringify(decryptPayslipDetails);
            
            // decryptPayslipDetails  = JSON.parse(decryptPayslipDetails);
            //console.log(Data1);
            jparse= JSON.parse(raw);
            let Data1 =[];
            Data1.push(raw);
            console.log(Data1);
            //psData.push(decryptPayslipDetails);
            psData.push(Data1);
        }
    }
    //let arr=[];
    //console.log(psData);
        for(var q=0;q<id.length;q++){
            for(var w=0;w<psData.length;w++){
            console.log(id[q]);
                
            if(id[q]==psData[w].empid){
                console.log(psData[w]);
                arr.push({
                    status:"Success",
                    data:psData[w]
                })
            }
        }
        }
        //console.log(psData);


                res.send({
                    status:"Success",
                    data:arr                   
                })
                
           
           
        } 
        catch(error){
            console.log(error)
            res.send({
                status:"Fail",
                data:"error in fetching ps details"
            })
        }
        
  }
})

module.exports=router;