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
                //console.log(Data1);
                data2.push(Data1);

            }
        }

       let arr=[];
       for(var j=0;j<data2.length;j++){
           arr.push({
               id:data2[j].empid,
               id_name:''+data2[j].empid+'-'+''+data2[j].employee_name});
       }
            res.send({
                status:"Success",
                data:arr
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