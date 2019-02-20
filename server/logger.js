const winston = require("winston");
const expressWinston = require("express-winston");

module.exports = function(app) {

  // Log all requests to a local file for diagnostics
  const requestTime = function(req, res, next) {
    req.requestTime = new Date().toISOString();
    next();
  };

  app.use(requestTime);

  app.use(
    expressWinston.logger({
      transports: [
        new winston.transports.File({
          name: "requests",
          filename: "requests.log",
          maxsize: 2500, // max size of each log file in bytes
          maxFiles: 1,
          tailable: true, // should make it so the oldest data will get removed from the file when it exceeds maxsize
        }),
      ],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
      ),
      meta: false, // logs meta data about the request if true
      msg: (req, res) => {
        return `${req.requestTime}: HTTP ${req.method} ${req.url} ${
          res.statusCode
        } /
Response-Time: ${res.responseTime}ms / 
User-Agent: ${req.headers["user-agent"]} / 
Cache-Control: ${req.headers["cache-control"]}`;
      },
      colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    }),
  );

  return app;
};