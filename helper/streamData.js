const multichain=require('../multichainAPI');
const helper=require('../helper/hex2str');

let rawData;
let data2=[];
let arr1=[];
let arr2=[];

async function sData(id,month,year){
    let PS = 'PS'+''+month+''+year;
    let listStreams =await multichain.listStreams();
    //console.log(listStreams);
                
    for(var i=0;i<listStreams.length;i++){
        rawData = await multichain.fetchData(listStreams[i].name,PS);
        //console.log('data ',rawData);
            
                
        for(var n=0;n<rawData.length;n++){
            let Data1 = await helper.hex2str(rawData[n].data);
            //console.log(Data1);
            Data1= JSON.parse(Data1);
            // console.log(Data1);
            data2.push(Data1);
            arr1.push(Data1);
        }
                
    }
            
    for(var j=0;j<data2.length;j++){          
        if(id==data2[j].empid){
        //arr1.push(data2[j]);
        
        arr2.push(data2[j]);
        break;
        }
        else{
            console.log("error in getting the data");
            }
    } 
    return arr2;
}

module.exports={
    sData:sData
};