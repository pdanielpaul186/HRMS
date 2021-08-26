function stringToHex(string){
    const bufferText = Buffer.from(string,'utf-8');
    const hex = bufferText.toString('hex');
    return hex;
}

function hexToString(hexValue){
    const bufferText = Buffer.from(hexValue,'hex');
    const string = bufferText.toString('utf-8');
    return string;
}

module.exports = {
    stringToHex:stringToHex,
    hexToString:hexToString
}