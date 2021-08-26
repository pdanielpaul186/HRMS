var express = require('express'),
    path = require('path'),
    nodeMailer = require('nodemailer'),
    bodyParser = require('body-parser');
 var fs=require('fs');
var path = require("path");
var glob = require("glob");
const multichain = require('../multichainAPI');
const helper = require('../helper/hex2str');
const EMPPATH = path.dirname(process.mainModule.filename);

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const router = express.Router();

let abc;
let year;
let arr = [];
let keyName;
let Email = [];
let rawData;
let data2 = [];
let attName;
let pathVar=[];


router.post('/', async function (req, res) {
    var d = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    let abc = req.body.month;
    console.log(abc);
    year = req.body.year;
    console.log(year);
    //let year=a.getFullYear;
    let PS = '' + abc + '-' + '' + year;
    //console.log(PS);

    //Get the data from payslip
    keyName = 'PS' + '' + abc + '' + year;

    let listStreams = await multichain.listStreams();
    //console.log(listStreams);
    for (var i = 0; i < listStreams.length; i++) {
        rawData = await multichain.fetchData(listStreams[i].name, keyName);
        //console.log('data ',rawData);
        for (var n = 0; n < rawData.length; n++) {
            let Data1 = await helper.hex2str(rawData[n].data);
            //console.log(Data1);
            Data1 = JSON.parse(Data1);
            // console.log(Data1);
            data2.push(Data1);

        }
    }

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'reachus@realvariable.com',
            pass: 'Variable@123'
        }
    });

        try {
            let email = [];
            //Getting employee details
            let data = [];
            let listStreams = await multichain.listStreams();
            for (var j = 0; j < listStreams.length; j++) {
                empRawData = await multichain.fetchData(listStreams[j].name, 'empDetails');
                //console.log('data ',rawData);


                for (var m = 0; m < empRawData.length; m++) {
                    let rawData = await helper.hex2str(empRawData[m].data);
                    //console.log(Data1);
                    Data = JSON.parse(rawData);
                    // console.log(Data12);
                    data.push(Data);

                }
            }
            
            let earr = req.body.empid;
            let logs = [];
            for (var a = 0; a < earr.length; a++) {
                for (var j = 0; j < data.length; j++) {
                    if (earr[a] == data[j].empid) {
                        email.push(data[j].busness_email_id);
                        let toAddress = data[j].busness_email_id;
                        console.log(email);
                        attName = "pdf/" + "" + earr[a] + "" + abc + "" + year + ".pdf";
                        console.log(attName);
                        htmlName="updatedHTML/"+""+earr[a]+""+abc+""+year+".html";
			console.log(htmlName);
                        pathVar="./" + attName;
                       console.log(pathVar); 
                        let mailOptions = {
                            from: '"Real Variable" <reachus@realvariable.com>', // sender address
                            to: toAddress,// list of receivers
                            subject: 'PAY-SLIP for the month of ' + '     ' + '' + PS, // Subject line
                            text: "", // plain text body
                            attachments: [
                                {
                                    path: pathVar
                                }
                            ],
                            html: '' // html body
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
					console.log(error);
                                // res.send({
                                //     Status: "Fail",
                                //     data: error,
                                //     message: arr
                                // })
                                // return console.log(errjor);
                                logs.push({
                                    status: "Fail",
                                    message: error
                                });
                            }
                            else{
                                console.log('Message %s sent: %s', info.messageId, info.response);
                            res.json({
                                "status": "success",
                                "message": "mail succesfully sent "
                            });
                            fs.unlink("./"+attName,(err)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log("PDF DELETED SUCCESSFULLY");
                                }
                            })
                            fs.unlink(htmlName,(err)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log("Html file DELETED SUCCESSFULLY");
                                }
                            })
                            }
                            
                        });
                       
                    }
                    else {
                        logs.push({
                            status: "Fail",
                            message: "Employee ID is not present"
                        })
                    }
                }

            }
            
            //res.send(logs);

        }
        catch (error) {
            console.log(error);
            
        }
        //console.log(Email);
        
    

    // let mailOptions = {
    //     from: '"sekhar" <sekhar.mekala@realvariable.com>', // sender address
    //     to: await maillist(''),// list of receivers
    //     subject: 'PAY-SLIP for the month of ' + '     ' + '' + PS, // Subject line
    //     text: "", // plain text body
    //     attachments: [
    //         {
    //             path: pathVar
    //         }
    //     ],
    //     html: '' // html body
    // };


    
  
    
arr=[];
});

module.exports = router;
