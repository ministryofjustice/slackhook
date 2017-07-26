const { promisify } = require("util");

const request = promisify(require("request"));

const config = require("./config");

exports.post = post;

function post(details) {
  return request({
    method: "POST",
    url: config.slack_hook_uri,
    json: details
  });
}
