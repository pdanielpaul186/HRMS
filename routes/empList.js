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

//Get employee details
router.get('/',(req,res)=>{
    users();
    async function users(){
        try {
            let listStreams =await multichain.listStreams();
            //console.log(listStreams);
            let rawData=[];
            var data2 = [];
            for(var i=0;i<listStreams.length;i++){
            rawData = await multichain.fetchData(listStreams[i].name,'empDetails');
            //console.log('data ',rawData);
          
            
            for(var n=0;n<rawData.length;n++)
            {
                let Data1 = await helper.hex2str(rawData[n].data);
                //console.log(Data1);
                Data1= JSON.parse(Data1);
                console.log(Data1);
                data2.push(Data1);

            }
        }
       
            res.send({
                status:"Success",
                data:data2
            })
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