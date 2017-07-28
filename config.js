module.exports = {
  port: getenv("PORT", 1337),
  slack_hook_uri: getenv("SLACK_WEBHOOK"),
  keyvault: {
    uri: getenv("KEYVAULT_URI"),
    prefix: getenv("KEYVAULT_USER_PREFIX"),
    client_id: getenv("KEYVAULT_CLIENT_ID"),
    client_secret: getenv("KEYVAULT_CLIENT_SECRET")
  },
  local_users: parseUsers(getenv("LOCAL_USERS", ""))
};

function getenv(name, fallback) {
  if (name in process.env && process.env[name]) {
    return process.env[name];
  }
  if (fallback) {
    return fallback;
  }
  throw new Error(`Missing ${name} environment variable`);
}

function parseUsers(usersString) {
  const users = {};
  usersString
    .split(",")
    .map(userpass => userpass.split(":"))
    .forEach(([user, pass]) => {
      users[user] = pass;
    });
  return users;
}
