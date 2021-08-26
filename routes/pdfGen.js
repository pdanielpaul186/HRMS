const multichain=require('../multichainAPI');
const express = require('express');
const bodyparser=require('body-parser');
const helper = require('../helper/hex2str');
const fs=require('fs');
const HTML5ToPDF=require('html5-to-pdf');
const path=require('path');
var numbersToWords=require('numbers-to-words');

//middleware 
const app = express();
const router = express.Router();
//let body=bodyparser();

//body parser
app.use( bodyparser.json() ); 

let data23=[];
let arr=[];
let name=[];
router.post('/',(req,res)=>{
    
    pdf();
  async function pdf(){
        
         //Getting employee details
         let listStreams =await multichain.listStreams();   
         for(var j=0;j<listStreams.length;j++){
           let empRawData = await multichain.fetchData(listStreams[j].name,'empDetails');
            //console.log('data ',empRawData);
          
            
            for(var m=0;m<empRawData.length;m++)
            {
                let Data12 = await helper.hex2str(empRawData[m].data);
                //console.log(Data12);
                Data12= JSON.parse(Data12);
              //console.log(Data12);
                data23.push(Data12);
            }
        }
    }
    var arr1=req.body.empid;
    console.log(arr1);
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
    console.log(n);
    var year = req.body.year;
    PS = ''+n+''+ year;
    console.log(PS);
    for (var i=0;i<arr1.length; i++) {
        name.push(''+arr1[i]+''+ PS);
    }
    console.log(name);
    let run = async function h2pdf(input,output) {
        console.log(name);
            for(var l=0;l<name.length;l++)
        {    input=  path.join("./updatedHTML",name[l]+".html");
            output= path.join("./pdf",name[l]+".pdf");
            console.log(input);
            console.log(output);
        console.log('KKKKKKKKKKKKKKK');
        const html5ToPDF = new HTML5ToPDF({
          inputPath:input ,
          outputPath: output,
          
         //templatePath: path.join(__dirname, "./app/html/index.html"),
        //   include: [
        //      //path.join("./app/html","logo.png"),
        //     //  path.join(__dirname, "assets", "custom-margin.css"),
        //    ],
        })
        //console.log(inputPath);
        await html5ToPDF.start()
        await html5ToPDF.build()
        await html5ToPDF.close()
        console.log("DONE")
        // process.exit(0)
        arr.push({
            status:"Success",
            Message:"PDF GENERATED SUCCESSFULLY"
        })

      }
       
       
      // Use the function in an existing promise chain
      Promise.resolve( 'something' )
      .then( result => {
        return result;
        
      } )
    //   .then( result => {
    //     // Because async functions are promises under the hood we can treat the run function as a promise
    //     return run()
    //   } ).catch(res)
      res.send({
        status:"Success",
        Message:arr
      })
    }
      // Usage in try/catch block
      try {
        run()
      } 
      catch (error) {
        console.error(error)
       }
      
  arr=[];
  arr1=[];
})


module.exports=router;
