import AuthClient from '../lib/azure-auth-client';

console.log(`Loading demo! URL is ${window.location.href}.`);

const resourceId = '<resourceId>';

const config = {azureAuthConfig: {clientType: 'ADAL',
                                  tenantId: '<tenantId>',
                                  clientId: '<clientId>',
                                  domain: '<domain>'}};

const client = AuthClient.build(config);

window.client = client;

window.logOut = async () => {
  client.logOut();
};

async function start() {
  let response = await client.getIdentityToken();

  console.log('Identity token response.', response);
  if(response.ok) {
    console.log("Identity token.", response.token);
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

  response = await client.getAccessToken(resourceId);
  console.log('Access token response.', response);

  if(response.ok) {
    console.log("Access token.", response.token);
  }
  else {
    console.log("Failed to get access token.", response);
  }
}

start();
