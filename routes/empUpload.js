const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const multichain=require("../multichainAPI");
const helper=require("../helper/hex2str");
const fs=require('fs');
const glob=require('glob');

//middleware 
const app = express();
const router = express.Router();
//let body=bodyParser();

//body parser
app.use(bodyParser.json());       
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
                input: "./"+req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, async function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                }
                else{

                }
                try {
                    console.log(result);
                    var arr=[];
                    for(let i=0;i<result.length;i++){
                        if(result[i].mobilenumber==''){
                            arr.push({
                                status: "Fail",
                                message: "Phone Number is empty",
                                rowNumber: i
                            });
                        }
                        else{
                            let obj = result[i];
                            obj.mcaddress = await multichain.address();
                            
                            try {
                                let create = await multichain.create(result[i].empid);
                            console.log('stream created');
                                let subscribe= await multichain.subscribe(result[i].empid);
                                console.log('stream subscribed');
                                let publish =await multichain.publishStream(result[i].empid,'empDetails',helper.str2hex(JSON.stringify(obj)));
                                let now = new Date();
                                console.log(i)
                                console.log(now)
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
                                    empid:result[i].empid,
                                    empname:result[i].employee_name
                                });
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
                                continue;
                            }
                            
                            
                        }
                        arr.push({
                            status: "Success",
                            message: "Successfully Uploaded",
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
                        message:"req.body.path",
                        data:error
                    })
                    console.log(error);
                }
               
                
            //     store();
            //     async function store(){
            //         try {
            //                 date='PS'+req.body.date;
            //                for(var i=0;i<result.length;i++){
            //                 id=result[i].id,
            //                 name=result[i].name,
            //                 gender=result[i].gender,
            //                 bdate=result[i].bdate,
            //                 educ=result[i].educ,
            //                 jobcat=result[i].jobcat,
            //                 salary=result[i].salary,
            //                 salbegin=result[i].salbegin,
            //                 jobtime=result[i].jobtime,
            //                 prevexp=result[i].prevexp
            //                 let mcaddress = await multichain.address();
            //                 let reg={id,name,gender,bdate,educ,jobcat,salary,salbegin,jobtime,prevexp,mcaddress};
            //                 console.log(reg);
            //                 let create = await multichain.create(result[i].name);
            //                 console.log('stream created');
            //                 let subscribe= await multichain.subscribe(result[i].name);
            //                 console.log('stream subscribed');
            //                 let publish =await multichain.publishStream(result[i].name,date,helper.str2hex(JSON.stringify(reg)));
                            
            //             }
            //             res.json({
            //                 status:"Sucess"
                            
            //             })
            //         } catch (error) {
            //             res.json({
            //                 status:"fail",
            //                 data:error
            //             })
            //             console.log(error);
            //         }
            //     }
            });
        } catch (e){
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }
    })
});


module.exports=router;
