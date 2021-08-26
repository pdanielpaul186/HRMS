const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const multichain=require("../multichainAPI");
const helper=require("../helper/hex2str");
const fs=require('fs');
const glob=require('glob');
const encryptor = require('../helper/encryption');
const string2hex = require('../helper/stingtoHex');

//middleware
//const cryptr = new CRYPTR('paySlip_Details'); 
const app = express();
const router = express.Router();
//let body=bodyParser();

//body parser
app.use( bodyParser.json() );       
// app.use(bodyParser.urlencoded({     
// extnded: true
// })); 



var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ //multer settings
                storage: storage,
                fileFilter : function(req, file, callback) { //file filter
                    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        return callback(new Error('Wrong extension type'));
                    }
                    callback(null, true);
                }
            }).single('file');
/** API path that will upload the files */
router.post('/', function(req, res) {
    var exceltojson;
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        /** Multer gives us file info in req.file object */
        if(!req.file){
            res.json({error_code:1,err_desc:"No file passed"});
            return;
        }
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input:"./"+req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, async function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                }
                try {
                    //console.log(result);
                    var arr=[];
                    
                    for(let i=0;i<result.length;i++){
                        if(result[i].empid==''){
                            arr.push({
                                status: "Fail",
                                message: "Employee ID is empty",
                                rowNumber: i
                            });
                        }
                        else{
                            let obj = result[i];
                            obj.mcaddress = await multichain.address();
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
                            var n = req.query.month;
                            //console.log(n);
                            var year=req.query.year;
                            //console.log(year);
                            obj.month=n;
                            obj.year=year;
                            let PS ='PS'+''+n+''+year;
                            try {
                                let create = await multichain.create(result[i].empid);
                            console.log('stream created');
                                let subscribe= await multichain.subscribe(result[i].empid);
                                console.log('stream subscribed');
                                console.log(result[i].empid);
                               // const payslipDetailsEncrypted = encryptor.encrypt(obj);
                               // console.log(payslipDetailsEncrypted);
                                 let publish =await multichain.publishStream(result[i].empid,PS,helper.str2hex(JSON.stringify(obj)));
                                 let options={};
                                 glob("./uploads/*.xlsx", options, function (er, files) {
                                    if(er){
                                        console.log(er);
                                    }
                                    else{
                                        for(var x=0;x<files.length;x++){
                                            let path =files[x];
                                            fs.unlink(path,(err)=>{
                                                if(err){
                                                    console.log("path incorrect");
                                                }
                                                else{
                                                    console.log("Excel file removed to save space !!!!!!!!!!!!!!");
                                                }
                                            })
                                        }
                                    }
                                  })  
                            
                            
                            
                            
                                } catch (error) {
                                arr.push({
                                    status: "Fail",
                                    message: 'Error Code: '+error.code +', '+error.message,
                                    rowNumber: i,
                                    empid:result[i].empid
                                });
                                glob("./uploads/*.xlsx",function (er, files) {
                                    if(er){
                                        console.log(er);
                                    }
                                    else{
                                        for(var x=0;x<files.length;x++){
                                            console.log(files);
                                            let path =files[x];
                                            console.log(path);
                                            fs.unlink(path,(err)=>{
                                                if(err){
                                                    console.log("path incorrect");
                                                }
                                                else{
                                                    console.log("Excel file removed to save space !!!!!!!!!!!!!!");
                                                }
                                            })
                                        }
                                    }
                                  })
                                continue;
                            }
                            
                            
                        }
                        arr.push({
                            status: "Success",
                            message: "",
                            rowNumber: i,
                            empid:result[i].empid,
                            empname:result[i].employee_name
                        });
                    }
                    //console.log(arr);
                    res.json({error_code:0,err_desc:null, data: arr});
                    
                } catch (error) {
                    res.json({
                        status:'fail',
                        data:error
                    })
                    console.log(error);
                }     
            });
        } catch (e){
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }
    })
});


module.exports=router;
