var liveServer = require("live-server");
var chokidar = require('chokidar');
const inlineTemplate = require('./utils/inlineTemplate.js');

var params = {
    port: 8888, // Set the server port. Defaults to 8080.
    root: "dist/", // Set root directory that's being served. Defaults to cwd.
    //open: "/template/",
    open: false,
    cors: true,
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
};
liveServer.start(params);

function onChange() {
    inlineTemplate.run()
}

const watcher = chokidar.watch(
    ['src/common/**/*', 'src/template/**/*'],
    {
        ignored: /(^|[\/\\])\../,
        persistent: true
    }
);

watcher.on('add', onChange)
    .on('change', onChange)
    .on('unlink', onChange);


