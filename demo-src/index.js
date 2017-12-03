import AuthClient from '../lib/azure-auth-client';

console.log(`Loading demo! URL is ${window.location.href}.`);

const RESOURCE = '<resource>';

const config = {azureAuthConfig: {clientType: 'ADAL',
                                  tenantName: '<tenantName>',
                                  clientId: '<clientId>',
                                  domain: '<domain>'}};

const client = AuthClient.build(config);

window.client = client;

window.logOut = async () => {
  client.logOut();
};

async function start() {
  const response = await client.getIdentityToken();

  console.log('Response', response);
  if(response.ok) {
    const message = `Logged in as ${response.name}.`;
    document.getElementById("text").innerHTML = message;
  }
  else {
    if(response.reason === 'login-error') {
      const message = `${response.reason}\n\n${response.error}\n\n${response.message}`;
      document.getElementById("text").innerHTML = message;
    }
    else {
      document.getElementById("text").innerHTML = response.reason;
    }
  }
}

start();
