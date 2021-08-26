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

let arr=[];
router.put('/',(req,res)=>{
    update();
    async function update(){
   try{  
    let  arr1=req.body.details;
   // console.log(arr1);
    for(var i=0;i<arr1.length;i++){
            empid=arr1[i].empid;
            employee_name=arr1[i].employee_name;
            leave_balance=arr1[i].leave_balance;
            total_leaves_taken=arr1[i].total_leaves_taken;
            paid_leave=arr1[i].paid_leave;
            adjustment=arr1[i].adjustment;
            basic=arr1[i].basic;
            hra=arr1[i].hra;
            conveyance=arr1[i].conveyance;
            medical_allowances=arr1[i].medical_allowances;
            bonus=arr1[i].bonus;
            travel_allowances=arr1[i].travel_allowances;
            other_allowances=arr1[i].other_allowances;
            provident_fund=arr1[i].provident_fund;
            esic=arr1[i].esic;
            tds=arr1[i].tds;
            professional_tax=arr1[i].professional_tax;
            loans_and_advances=arr1[i].loans_and_advances;
            any_other_deduction=arr1[i].any_other_deduction;
            gross_earnings=arr1[i].gross_earnings;
            gross_deductions=arr1[i].gross_deductions;
            net_salary_payable=arr1[i].net_salary_payable;
            working_days=arr1[i].working_days;
            loss_of_pay_days=arr1[i].loss_of_pay_days;
            total_paid_days=arr1[i].total_paid_days;
            leave_balance_eom=arr1[i].leave_balance_eom;
            mode_of_payment=arr1[i].mode_of_payment;
            payment_date=arr1[i].payment_date;
            net_salary_payable=arr1[i].net_salary_payable;
            month=arr1[i].month;
            year=arr1[i].year;
            let PS='PS'+''+month+''+year;
            console.log(PS);
            console.log(arr1[i].empid);
            let obj={empid,employee_name,leave_balance,total_leaves_taken,paid_leave,adjustment,basic,hra,conveyance,medical_allowances,bonus,travel_allowances,other_allowances,provident_fund,esic,tds,professional_tax,loans_and_advances,any_other_deduction,gross_earnings,gross_deductions,net_salary_payable,working_days,loss_of_pay_days,total_paid_days,leave_balance_eom,mode_of_payment,payment_date,net_salary_payable,month,year};
            let publish =await multichain.publishStream(arr1[i].empid,PS,helper.str2hex(JSON.stringify(obj)));
           arr.push({
               status:"success",
               data:publish
           })
        }
        res.send({
            status:"Success",
            message:"Updated successfully",
            data:arr
       
       })
    } 
     catch (error) {
        res.send({
            status:"Fail",
            message:error
        })
        console.log(error);
       }
     }
    })

module.exports=router;