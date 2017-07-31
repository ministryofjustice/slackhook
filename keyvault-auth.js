const url = require('url');

const KeyVault = require('azure-keyvault');
const AuthenticationContext = require('adal-node').AuthenticationContext;

module.exports = function makeKeyvaultAuth(config) {
  const client = createVaultClient(
    config.uri, config.client_id, config.client_secret
  );

  return {
    check(username, password) {
      return client.getSecret(config.prefix + username)
        .then((storedHash) => password === storedHash);
    }
  }
}

function createVaultClient(vaultUri, clientId, clientSecret) {
  const credentials = new KeyVault.KeyVaultCredentials(authenticator);
  const client = new KeyVault.KeyVaultClient(credentials);

  const secretsBase = url.resolve(vaultUri, '/secrets/');

  return {
    getSecret(name) {
      const uri = url.resolve(secretsBase, encodeURIComponent(name));
      return client.getSecret(uri)
        .then(
          (secret) => secret.value,
          (err) => {
            if (err.code === 'SecretNotFound') {
              console.log("%s not found in keyvault", name);
              return null;
            }
            throw err;
          }
        );
    }
  }

  function authenticator(challenge, callback) {
    var context = new AuthenticationContext(challenge.authorization);
    return context.acquireTokenWithClientCredentials(
      challenge.resource, clientId, clientSecret,
      function(err, response) {
        if (err) return callback(err);
        callback(null, response.tokenType + ' ' + response.accessToken);
      }
    );
  }
}
