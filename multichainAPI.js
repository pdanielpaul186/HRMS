const multichain = require("./multichainConn");

//Get the addresses
var address = function() {
    return new Promise((resolve, reject)=>{
        multichain.getNewAddress((err,add)=>{
            if (err){
                console.log('error in getting address',err)
                reject(err);
            }
            else{
                return resolve(add);
             }
        });
    });
}

//Get the new addresses
var newaddress = function() {
    return new Promise((resolve, reject)=>{
        multichain.getNewAddresses((err,add)=>{
            if (err){
                console.log('error in getting new address',err)
                reject(err);
            }
            else{
                return resolve(add);
             }
        });
    });
}

//Grant permissions
let grant = function(address) {
    return new Promise((resolve, reject)=>{
      multichain.grant({addresses: address, permissions:  "send,receive" }, (err, tx) => {
            if(err){
                return reject(err);
            } 
         return resolve(tx);
        });
    });    
}

//create streams
let create = function(name) {
    return new Promise((resolve, reject)=>{
      multichain.create({type: "stream", name: name, open: true}, (err, tx) => {
            if(err){
                return reject(err);
            } 
         return resolve(tx);
        });
    });    
}

//subscribe streams
let subscribe = function(streamName) {
    return new Promise((resolve, reject)=>{
      multichain.subscribe({stream: streamName }, (err, tx) => {
            if(err){
                return reject(err);
            } 
         return resolve(tx);
        });
    });    
}

//subscribe assets
let asset_subscribe = function(assetName) {
    return new Promise((resolve, reject)=>{
      multichain.subscribe({asset: assetName}, (err, tx) => {
            if(err){
                return reject(err);
            } 
         return resolve(tx);
        });
    });    
}

//enter data into stream
let publishStream = function(streamName, key, data) {
    return new Promise((resolve, reject)=>{
      multichain.publish({stream: streamName, key: key, data:data }, (err, tx) => {
            if(err){
                return reject(err);
            } 
         return resolve(tx);
        });
    });    
}

//fetching data from stream
let fetchData=function(name,key){
    return new Promise((resolve,reject)=>{
        multichain.listStreamKeyItems({stream:name,key:key,verbose:false,count:1},(err,data)=>{
            if(err){
                return reject(err);
            }
            else{
               
               return resolve(data);
            }
        });
    });
}

//issue asset 
let issueAsset= function(fromAddress,toAddress,name,units,qty){
        return new Promise((resolve,reject)=>{
        multichain.issueFrom({from:fromAddress, to:toAddress, asset:name, qty:qty, units:units},(err,data)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        })
    })
}



//asset transaction
let asset_trx = function(fromaddress,toaddress,asset,qty){
    return new Promise((resolve,reject)=>{
        multichain.sendAssetFrom({from: fromaddress,to: toaddress,asset: asset,qty: qty},(err,data)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        })
    })
}

//List asset transactions based on asset
let trx_display=function(asset){
    return new Promise((resolve,reject)=>{
        multichain.listAssetTransactions({asset:asset},(err,data)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        })
    })
}

//list streams
let listStreams=function(){
    return new Promise((resolve,reject)=>{
        multichain.listStreams((err,data)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        })
    })
}

module.exports = {
    address: address,
    newaddress:newaddress,
    grant:grant,
    create:create,
    asset_subscribe:asset_subscribe,
    subscribe:subscribe,
    publishStream:publishStream,
    fetchData:fetchData,
    issueAsset:issueAsset,
    asset_trx:asset_trx,
    trx_display:trx_display,
    listStreams:listStreams
}