var fs = require('fs-extra');
const path = require('path');
const target = path.resolve('dist');
fs.emptyDir(target)
    .then(() => {
        console.log('success!')
    })
    .catch(err => {
        console.error(err)
    })