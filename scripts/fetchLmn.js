var https = require('https');
var fs = require('fs');

var file = fs.createWriteStream("./template/js/lmn.js");
https.get(
    "https://raw.githubusercontent.com/ztiromoritz/lmn/master/src/lmn.js",
    response => response.pipe(file),
    err=>console.error(err));