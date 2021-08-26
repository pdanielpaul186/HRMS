const multichain = require('../multichainAPI');
const express = require('express');
const bodyparser = require('body-parser');
const helper = require('../helper/hex2str');
const fs = require('fs');
const HTML5ToPDF = require('html5-to-pdf');
const path = require('path');
var numbersToWords = require('numbers-to-words');
//const CRYPTR = require('cryptr');

let secret_key = 'ppaySSlip DDetailss';
var encryptor = require('simple-encryptor')({
    key: secret_key.toString('hex'),
    hmac: false,
    debug: true
});

//middleware 
//const cryptr = new CRYPTR('paySlip_Details');
const app = express();
const router = express.Router();
//let body=bodyparser();

//body parser
app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({     
// extended: true
// })); 

let PS;
let psdetails = [];
let empdetails = [];
var object1;
let rawData = [];
let data2 = [];
let data23 = [];
let name = [];


async function converter(salary) {
    let word;
    var numberg;
    // console.log(numberg);
    //word = await numbersToWords(psdetails[0].Net_Salary_Payable);
    word = await numbersToWords(salary);
    console.log(word.response);
    numberg = word.response;
    return numberg;
    // word=letter.response;
}

function numberWithCommas(input) {
var value = input | 0;
if(value== 0){
return value.toFixed(2);
// var value = input | 0;
// console.log("valueee::",value)
}
else
{
if (input) {
var tofixed=parseFloat(input).toFixed(2);
// var currencySymbol = '₹';
//var output = Number(input).toLocaleString('en-IN'); <-- This method is not working fine in all browsers!
var result = tofixed.toString().split('.');

var lastThree = result[0].substring(result[0].length - 3);
var otherNumbers = result[0].substring(0, result[0].length - 3);
if (otherNumbers != '')
lastThree = ',' + lastThree;
var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
if (result.length > 1) {
output += "." + result[1];
}

return output;
}
}
}


router.post('/', (req, res) => {
    users();
    async function users() {
        try {
            var arr=[];
            var arr1 = req.body.empid;
            // let rqarr
            // //console.log(req.body)
            // console.log("REquest --------->",rqarr);
            // for(var v=0;v<rqarr.length;v++){
            //     arr1.push(rqarr[v]);
                
            // }
            //console.log(arr1);

           
            var n = req.body.month;
            //console.log(n);
            var year = req.body.year;
            //console.log(year);
            //let year=a.getFullYear;
             PS = 'PS' + '' + n + '' + year;

            let listStreams = await multichain.listStreams();
            console.log(listStreams);

            for (var i = 0; i < listStreams.length; i++) {
                rawData = await multichain.fetchData(listStreams[i].name, PS);
                console.log(rawData);


                for (var za = 0; za < rawData.length; za++) {
                    let Data1 = await helper.hex2str(rawData[za].data);
                    // const decryptPayslipDetails = encryptor.decrypt(Data1);
                    // console.log(decryptPayslipDetails);
                    //decryptPayslipDetails  = JSON.parse(decryptPayslipDetails);
                    Data1 = JSON.parse(Data1)
                    // console.log(Data1);
                    //data2.push(decryptPayslipDetails);
                    data2.push(Data1);
                }
            }
		console.log("------------YTRT");console.log(data2);

            //Getting employee details

            for (var j = 0; j < listStreams.length; j++) {
                empRawData = await multichain.fetchData(listStreams[j].name, 'empDetails');
                //console.log('data ',rawData);


                for (var m = 0; m < empRawData.length; m++) {
                    let Data12 = await helper.hex2str(empRawData[m].data);
                    //console.log(Data1);
                    Data12 = JSON.parse(Data12);
                    // console.log(Data12);
                    data23.push(Data12);


                }
            }


            //Sending the employee details to the payslip format
            for (var a = 0;a<data23.length;a++) {
               
                for (var c=0;c<arr1.length; c++) {
                   // console.log('sbfuagdfsa');
                   //console.log(arr1[c]);
                   //console.log(data23[a].empid)
                    if (arr1[c] == data23[a].empid) {
                        

                        console.log("IFBLOCK--------------------")
                        // console.log("req.body.empid==data23[q].empid",req.body.empid==data23[a].empid);
                        Name = data23[a].employee_name;
                        DOB = data23[a].date_of_birth;
                        Designation = data23[a].designation;
                        Employee_Bank = data23[a].bank;
                        Bank_Account = data23[a].bank_account_number;
                        Empid = data23[a].empid;
                        DateOfJoining = data23[a].date_of_joining;
                        PFNumber = data23[a].pf_number;
                        ESINumber = data23[a].esi_number;
                        PANNumber = data23[a].pan_number;
                        let raw = { Name, DOB, Designation, Employee_Bank, Bank_Account, Empid, DateOfJoining, PFNumber, ESINumber, PANNumber }
                        // console.log(raw);
                        empdetails.push(raw);
                        //   arr1.push({
                        //     status:"Sucess",
                        //     data:empdetails
                        // });
                        //break;
                    }

                    else {
                        arr.push({
                            status: "Fail",
                            Message: "NO Employee with the given ID"
                        });
                    }

                }
            }

            //sending the payslip details 
            for (var b = 0; b < data2.length; b++) {
                for (var d = 0; d < arr1.length; d++) {
                    if (arr1[d] == data2[b].empid) {
                        console.log("data2:",data2[b]);
                        Basic = data2[b].basic;
                        houseRentAllowance = data2[b].hra;
                        Conveyance = data2[b].conveyance;
                        medicalAllowance = data2[b].medical_allowances;
                        Bonus = data2[b].bonus;
                        travel_allowances = data2[b].travel_allowances;
                        other_allowances = data2[b].other_allowances;
                        PF = data2[b].provident_fund;
                        ESIC = data2[b].esic;
                        TDS = data2[b].tds;
                        Professional_Tax = data2[b].professional_tax;
                        Loans_and_Advances = data2[b].loans_and_advances;
                        Any_Other_Deduction = data2[b].any_other_deduction;
                        Gross_Earnings = data2[b].gross_earnings;
                        Gross_Deductions = data2[b].gross_deductions;
                        Net_Salary_Payable = data2[b].net_salary_payable;
                        Working_Days = data2[b].working_days;
                        Loss_of_Pay_days = data2[b].loss_of_pay_days;
                        Total_Paid_Days = data2[b].total_paid_days;
                        Leave_Balance_EOM = data2[b].leave_balance_eom;
                        Mode_of_payment = data2[b].mode_of_payment;
                        Payment_Date = data2[b].payment_date;
                        Net_Salary_Payable = data2[b].net_salary_payable;
                        month = data2[b].month;
                        year = data2[b].year;




			let basic1 = Basic.toString();
			let pf1 = PF.toString();







                        let raw1 = { basic1, houseRentAllowance, Conveyance, medicalAllowance, Bonus, travel_allowances, other_allowances, pf1, ESIC, TDS, Professional_Tax, Loans_and_Advances, Any_Other_Deduction, Gross_Earnings, Gross_Deductions, Net_Salary_Payable, Working_Days, Loss_of_Pay_days, Total_Paid_Days, Leave_Balance_EOM, Mode_of_payment, Payment_Date, Net_Salary_Payable, month, year }
                       
			 psdetails.push(raw1);

                        // arr1.push({
                        //     status:"Sucess",
                        //     data:psdetails
                        // });
                    }
                    else {
                        arr.push({
                            status: "Fail",
                            Message: "NO Employee with the given ID"
                        });
                    }


                }
            }
            //console.log(empdetails);
              object1= {
                 emp:empdetails,
                 ps:psdetails
             };  
		console.log(object1)
           // console.log(arr1);
            for (var e=0;e<arr1.length;e++) {
                //console.log(arr1[e]);
                for (var r=0;r<empdetails.length;r++) {

                    console.log(empdetails[r].Empid)

                    console.log(arr1[e]) ;
                    //console.log(empdetails[i].Empid)     
                    if (arr1[e] == empdetails[r].Empid) {
                       // console.log(arr1[e]);
                        //console.log(empdetails[r].Name);
                        //console.log(psdetails[i].houseRentAllowance);
                        //res.render(__dirname + 'html/index.html', {name:empdetails[i].Name,dob:DOB,des:Designation,empb:Employee_Bank,bac:Bank_Account,id:Empid,doj:DateOfJoining,pfn:PFNumber,esin:ESINumber,pan:PANNumber,bas:Basic,hra:houseRentAllowance,con:Conveyance,ma:medicalAllowance,bon:Bonus,ta:travelAllowance,oa:otherAllowances,pf:PF,esic:ESIC,tds:TDS,ptx:Professional_Tax,laa:Loans_and_Advances,aod:Any_Other_Deduction,ge:Gross_Earnings,gd:Gross_Deductions,nsp:Net_Salary_Payable,wd:Working_Days,lop:Loss_of_Pay_days,tpd:Total_Paid_Days,lb:Leave_Balance_EOM,mop:Mode_of_payment,pd:Payment_Date,nsp:Net_Salary_Payable});
                        //console.log(name);

                        fs.readFile('./html/index.html', null, async (error, data) => {
                            //console.log("IN FILE FUNCTIBONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN");
                            if (error) {
                                console.log(error);
                                //console.log("ysaiFHhsdodgio")
                                arr.push(error);
                            }
                            else {
                                //console.log("else condition");
                                //console.log(empdetails);
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
                                var n = req.body.month;
                                //console.log(n);
                                var year = req.body.year;
                                //console.log(year);
                                //let year=a.getFullYear;
                                PS = '' + n + '' + year;
                                name=[];
                                for (var g = 0; g < empdetails.length; g++) {
                                    name.push(empdetails[g].Empid + PS);
                                    console.log("NAME------------------------>>>",name);
                                    //console.log("DATA",empdetails);
                                    // converter();
                                    //  console.log(numberg);
                                    //let epay=''+empdetails[i].Name+''+PS;
                                    //if(name[i]==)
                                    // if(psdetails[g]=="")
                                    // {
                                //         let template = data.toString();
                                //     //empdetails
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{month}}', n);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{year}}', year);
                                //     template = template.replace('{{name}}', empdetails[g].Name);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{dob}}',empdetails[g].DOB);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{desi}}',empdetails[g].Designation);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{empBank}}',empdetails[g].Employee_Bank);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{bankAC}}',empdetails[g].Bank_Account);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{empid}}',empdetails[g].Empid);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{doj}}',empdetails[g].DateOfJoining);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{pfno}}',empdetails[g].PFNumber);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{ESI}}',empdetails[g].ESINumber);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{PAN}}',empdetails[g].PANNumber);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);

                                //     //psdetails
                                    
                                //     template = template.replace('{{basic}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{hra}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{con}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{moa}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{ta}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{sa}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{bonus}}',"N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{pf}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{esic}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{tds}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{pt}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{laa}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{aod}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{GEA}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{GDB}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{td}}',"N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{tsd}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{lop}}', "N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{lbeom}}',"N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{mop}}',"N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{date}}',"N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{empBank}}',"N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{bankAC}}',"N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{nsp}}',"N/A");
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     template = template.replace('{{nsp}}', "N/A");

                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //     var text = await numbersToWords(psdetails[g].Net_Salary_Payable);
                                //     template = template.replace('{{word}}', "N/A");
                                //     //console.log(text.response,text);
                                //     fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                //    // }
                                    
                                    let template = data.toString();
                                    //empdetails
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{month}}', n);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{year}}', year);
                                    template = template.replace('{{name}}', empdetails[g].Name);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{dob}}',empdetails[g].DOB);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{desi}}',empdetails[g].Designation);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{empBank}}',empdetails[g].Employee_Bank);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{bankAC}}',empdetails[g].Bank_Account);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{empid}}',empdetails[g].Empid);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{doj}}',empdetails[g].DateOfJoining);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{pfno}}',empdetails[g].PFNumber);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{ESI}}',empdetails[g].ESINumber);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{PAN}}',empdetails[g].PANNumber);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);

                                    //psdetails
                                    
                                    template = template.replace('{{basic}}',numberWithCommas(psdetails[g].basic1));
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{hra}}', psdetails[g].houseRentAllowance);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{con}}', psdetails[g].Conveyance);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{moa}}', psdetails[g].medicalAllowance);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{ta}}', psdetails[g].travel_allowances);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{sa}}', psdetails[g].other_allowances);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{bonus}}', psdetails[g].Bonus);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{pf}}', numberWithCommas(psdetails[g].pf1));
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{esic}}', psdetails[g].ESIC);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{tds}}', psdetails[g].TDS);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{pt}}', psdetails[g].Professional_Tax);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{laa}}', psdetails[g].Loans_and_Advances);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{aod}}', psdetails[g].Any_Other_Deduction);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{GEA}}', psdetails[g].Gross_Earnings);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{GDB}}', psdetails[g].Gross_Deductions);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{td}}', psdetails[g].Working_Days);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{tsd}}', psdetails[g].Total_Paid_Days);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{lop}}', psdetails[g].Loss_of_Pay_days);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{lbeom}}', psdetails[g].Leave_Balance_EOM);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{mop}}', psdetails[g].Mode_of_payment);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{date}}', psdetails[g].Payment_Date);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{empBank}}',empdetails[g].Employee_Bank);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{bankAC}}',empdetails[g].Bank_Account);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{nsp}}', psdetails[g].Net_Salary_Payable);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    template = template.replace('{{nsp}}', psdetails[g].Net_Salary_Payable);

                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    var text = await numbersToWords(psdetails[g].Net_Salary_Payable);
                                    template = template.replace('{{word}}', text.response);
                                    //console.log(text.response,text);
                                    fs.writeFileSync('./updatedHTML/' + name[g] + '.html', template);
                                    //console.log(input); 
                                    //    html2pdf.abcd(input,output);
                                }


                            }
                        
                        })

                    }
                    else {
                        arr.push({
                            status:"Fail",
                            message:"PAYSLIP CANT BE GENERATED"
                        })
                    }
                   // break; 
                }
          
            }
            res.json({
                status: 'SUCESS',
                Message: "HTML GENERATED FOR GIVEN ID's"//,
                // emp:empdetails,
                //  ps:psdetails
            })

        }

        catch (error) {
            res.json({
                Status: "FAIL",
                Data: arr
            })
            console.log(error);

        }
        
    }
    arr=[];
    name=[];
    arr1=[];
})

module.exports = router;
