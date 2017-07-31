const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const config = require("./config");
const authentication = require('./authentication');
const slack = require("./slack");
const kudu = require("./kudu");

const app = express();

app.use(morgan("short", {
  stream: { write(msg) { console.log(msg.trim()); } }
}));
app.use(bodyParser.json());

app.use(authentication(config.keyvault, config.local_users));

app.get("/", (req, res) => {
  res.sendFile(require.resolve("./index.html"));
});

app.post("/kudu", (req, res, next) => {
  const channel = coerceChannel(req.query.channel);
  const postDetails = Object.assign(
    { channel },
    kudu.parse(req.body)
  );
  slack.post(postDetails).then(() => res.json({ ok: true })).catch(next);
});

function coerceChannel(channel) {
  if (channel[0] != "#") {
    return "#" + channel;
  }
  return channel;
}

app.use((req, res) => {
  res.status(404);
  res.json({error: "not-found"});
})
app.use((err, req, res, next) => {
  res.status(500);
  console.warn("Unexpected error", err);
  res.json({error: "unexpected", details: err.message});
});

module.exports = app;
