const express = require('express');
const bodyParser = require('body-parser');

//middleware 
const app = express();
const router = express.Router();
//let body=bodyParser();

//body parser
app.use( bodyParser.json() );       

let arr=[];
let data;
router.get('/',(req,res)=>{
    for(var i=2017;i<=2050;i++){
        arr.push(i);
        
    }
    res.send({year:arr});
    arr=[];
})

module.exports=router;