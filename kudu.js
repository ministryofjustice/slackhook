exports.parse = function parse(payload) {
  const success = isSuccessful(payload);
  return {
    attachments: [
      {
        fallback: getFallback(payload),
        color: success ? "good" : "danger",
        author: payload.author,
        title: payload.siteName,
        title_link: payload.hostName,
        text: getText(payload),
        ts: new Date(payload.endTime) / 1000,
        mrkdwn_in: ["text"]
      }
    ]
  };
};

function isSuccessful(payload) {
  return payload.status == "success" && payload.complete;
}

function getFallback(payload) {
  const success = isSuccessful(payload);
  const { author, siteName, endTime, message, id } = payload;
  return (
    siteName +
    " - " +
    (success ? "released ok" : "release failed") +
    +" " +
    endTime +
    " " +
    id
  );
}

function getText(payload) {
  const success = isSuccessful(payload);
  const { message, id } = payload;
  return (
    (success ? "Success" : ":warning: Failed") +
    (" `" + id + "`") +
    "\n" +
    ("```\n" + String(message).trim() + "\n```")
  );
}
