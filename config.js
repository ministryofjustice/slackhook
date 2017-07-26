module.exports = {
  port: getenv("PORT") || 1337,
  slack_hook_uri: getenv("SLACK_WEBHOOK"),
  keyvault: {
    uri: getenv("KEYVAULT_URI"),
    prefix: getenv("KEYVAULT_USER_PREFIX"),
    client_id: getenv("KEYVAULT_CLIENT_ID"),
    client_secret: getenv("KEYVAULT_CLIENT_SECRET")
  },
  local_users: getenv("LOCAL_USERS", parseUsers)
};

function getenv(name, coerce = x => x) {
  if (name in process.env) {
    return coerce(process.env[name]);
  }
  return null;
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
