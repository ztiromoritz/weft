var liveServer = require("live-server");

var params = {
    port: 8181, // Set the server port. Defaults to 8080.
    root: "template/", // Set root directory that's being served. Defaults to cwd.
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
};
liveServer.start(params);