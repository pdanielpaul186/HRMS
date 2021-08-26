const multichain=require('../multichainAPI');
const express = require('express');
const bodyparser=require('body-parser');
const helper = require('../helper/hex2str');
//middleware 
const app = express();
const router = express.Router();
//let body=bodyparser();

//body parser
app.use( bodyparser.json() );       
// app.use(bodyparser.urlencoded({     
// extended: true
// })); 
let arr1=[];
router.put('/',(req,res)=>{
    update();
    async function update(){ 
        try {
            
                let arr=req.body.details;
                for(var i=0;i<arr.length;i++){
                    empid=arr[i].empid;
                    employee_name=arr[i].employee_name;
                    date_of_birth=arr[i].date_of_birth;
                    designation=arr[i].designation;
                    bank=arr[i].bank;
                    bank_account_number=arr[i].bank_account_number;
                    date_of_joining=arr[i].date_of_joining;
                    pf_number=arr[i].pf_number;
                    esi_number=arr[i].esi_number;
                    pan_number=arr[i].pan_number;
                    blood_group=arr[i].blood_group;
                    cetagory=arr[i].cetagory;
                    reporting_to=arr[i].reporting_to;
                    annual_ctc=arr[i].annual_ctc;
                    confirmation_period=arr[i].confirmation_period;
                    confirmation_date=arr[i].confirmation_date;
                    date_of_resignation=arr[i].date_of_resignation;
                    notice_period=arr[i].notice_period;
                    last_working_day=arr[i].last_working_day;
                    adhaar_number=arr[i].adhaar_number;
                    personalemail=arr[i].personalemail;
                    mobilenumber=arr[i].mobilenumber;
                    current_address=arr[i].current_address;
                    parmanent_address=arr[i].parmanent_address;
                    branch=arr[i].branch;
                    ifsc_code=arr[i].ifsc_code;
                    busness_email_id=arr[i].busness_email_id;
                    name=arr[i].name;
                    relation=arr[i].relation;
                    mobile_no=arr[i].mobile_no;
                    let obj={empid,employee_name,date_of_birth,designation,bank,bank_account_number,date_of_joining,pf_number,esi_number,pan_number,blood_group,cetagory,reporting_to,annual_ctc,confirmation_period,confirmation_date,date_of_resignation,notice_period,last_working_day,adhaar_number,personalemail,mobilenumber,current_address,parmanent_address,branch,ifsc_code,busness_email_id,name,relation,mobile_no};
                    let publish =await multichain.publishStream(arr[i].empid,'empDetails',helper.str2hex(JSON.stringify(obj)));
                    arr1.push({
                        //status:"Updated Sucessfully",
                        data:publish
                    })
                }
                res.send({
                    status:"Updated Successfully",
                    data:arr1
                })



                   
                    
                    
                
               
                        
        } catch (error) {
            res.send({
                status:"Fail",
                message:error
            })
            console.log(error);
        }
    
    }
})



module.exports=router;