const http = require("http");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const slack = require("./slack");
const kudu = require("./kudu");
const config = require("./config");

const app = express();

app.use(morgan("short"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(require.resolve("./index.html"));
});

app.post("/kudu", (req, res, next) => {
  const postDetails = Object.assign(
    { channel: req.query.channel },
    kudu.parse(req.body)
  );
  slack.post(postDetails).then(() => res.json({ ok: true })).catch(next);
});

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log("Server listening on %j", server.address());
});
