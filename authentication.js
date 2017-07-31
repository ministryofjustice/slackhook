const basicAuth = require('basic-auth');

const makeKeyvaultAuth = require('./keyvault-auth')

module.exports = function authentication(keyvaultConfig, localUsers) {
  const checkAuth = makeAuthenticator(keyvaultConfig, localUsers);

  return function middleware(req, res, next) {
    checkAuth(basicAuth(req))
      .then(
        (authed) => {
          if (authed) {
            return next();
          }
          return unauthenticated(res);
        },
        next
      );
  }
}

function unauthenticated(res) {
  res.set('WWW-Authenticate', 'Basic realm=Password Required');
  res.status(401);
  res.json({
    error: 'authentication-required'
  });
};

function makeAuthenticator(keyvaultConfig, localUsers) {

  function checkLocalUser(name, pass) {
    if (name in localUsers) {
      return (localUsers[name] === pass);
    }
    return null;
  }

  const keyvaultAuth = makeKeyvaultAuth(keyvaultConfig);

  return function authenticated({name, pass} = {}) {
    if (!name || !pass) {
      console.log("Auth header invalid");
      return Promise.resolve(false);
    }

    const localResult = checkLocalUser(name, pass);
    if (localResult != null) {
      console.log("Local user found");
      return Promise.resolve(localResult)
    }

    console.log("checking for %s in keyvault", name);
    return keyvaultAuth.check(name, pass);
  }

}
