
const inline = require('inline-source');
const fs = require('fs-extra');
const path = require('path');
const htmlpath = path.resolve('./src/template/index.html');
const rootpath =  path.resolve('./src/template');
const target = path.resolve('dist/template');


function prepareHtml(){
    return new Promise((resolve,reject)=>{
        inline(htmlpath, {
            /**
             * Troubleshooting:
             *
             * If one of the files wont be inlined, you can remove the inline-compress attribute
             * at the source-tag. There seems to be no error message when the source is not es5 conform.
             *
             * Just adding const instead of var broke the compressed inline once.
             * 'uglify-js' which is used be inline-source does not seem to support this.
             */
            compress: false,
            rootpath: rootpath
        }, function (err, html) {
            if(err){
                reject(err)
            }else{
                resolve(html);
            }
        });
    });

}

function writeFile(html){
    fs.writeFile(path.resolve(target, "index.html"), html);
}

module.exports = {
    run : ()=>{
        fs.emptyDir(target)
            .then(prepareHtml)
            .then(writeFile)
            .catch(console.error);
    }
};

