const http = require("http");

const config = require("./config");
const app = require("./app");

const server = http.createServer(app);

process.on('uncaughtException', bailOut);
process.on('unhandledRejection', bailOut);

function bailOut(err) {
  console.error("Uncaught Error", err);
  server.close();
  process.exitCode = 1;
  setTimeout(() => process.exit(), 1000).unref();
}

server.listen(config.port, () => {
  console.log("Server listening on %j", server.address());
});
