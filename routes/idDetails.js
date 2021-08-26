const multichain=require('../multichainAPI');
const bodyParser = require('body-parser');
const express=require('express');
const helper=require('../helper/hex2str');

//middleware 
const app = express();
const router = express.Router();
//body parser
app.use( bodyParser.json() );    

//Getting IDs
router.get('/',(req,res)=>{
    let arr=req.query.empid;
    console.log(arr);
    users();
    async function users(){
        try {
            let listStreams =await multichain.listStreams();
            //console.log(listStreams);
            let rawData=[];
            var empDetails = [];
            var psData=[];
            for(var i=0;i<listStreams.length;i++){
            rawData = await multichain.fetchData(listStreams[i].name,'empDetails');
            //console.log('data ',rawData);
          
            
            for(var n=0;n<rawData.length;n++)
            {
                let hex = await helper.hex2str(rawData[n].data);
                //console.log(Data1);
                let jparse= JSON.parse(hex);
                //console.log(Data1);
                empDetails.push(jparse);

            }
        }
         //getting payslip details
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
         var n = month[d.getMonth() - 1];
         //console.log(n);
         var year = d.getFullYear();
         //console.log(year);
         //let year=a.getFullYear;
         let PS = 'PS' + '' + n + '' + year;

        // let listStreams = await multichain.listStreams();
         //console.log(listStreams);

         for (var q= 0; q < listStreams.length; q++) {
             rawData = await multichain.fetchData(listStreams[q].name, PS);
             //console.log('data ',rawData);


             for (var w = 0; w< rawData.length; w++) {
                 let raw = await helper.hex2str(rawData[w].data);
                 //console.log(Data1);
                 let jparsed = JSON.parse(raw);
                 // console.log(Data1);
                 psData.push(jparsed);

             }
             console.log(psData);
         }

       for(var j=0;j<empDetails.length;j++){
           if(empDetails[j].empid==arr){
              
               res.send({
                   id:arr,
                   empDetails:empDetails[j],
                   psDetails:psData[j]
               });

           }else{
               console.log("shdbaisdfnwd");
           }
       
    }
            
        } 
        catch (error) {
            res.json({
                Status:"FAIL",
                Data:error
            })
            console.log(error);
            
        }
    }
})


module.exports=router;