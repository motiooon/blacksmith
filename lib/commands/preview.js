var smith = require("../blacksmith"),
    winston = require("winston"),
    colors = require("colors");

module.exports = function () {
  winston.info("Executing command "+"preview".yellow);

  var HTTPServer = require('http-server').HTTPServer;
  var httpServer = new HTTPServer({
    root: './public/',
    port: process.env.PORT || process.env.C9_PORT || 8080
  });

  httpServer.log = winston.info;

  httpServer.start();

  process.on('SIGINT', function() {
    winston.warn('http-server stopped.'.red);
    process.exit(0);
  });
}
