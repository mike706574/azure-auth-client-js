import * as AuthenticationContext from './adal/adal';
import * as struct from './struct';
import arity from './arity';
import { decode, addIdentity } from './common';

function handleLogin(authContext) {
  const error = localStorage['adal.error'];

  if(error === undefined) {
    authContext.login();
    return {ok: false, reason: 'login-triggered'};
  }

  if(error === '') {
    return {ok: true};
  }

  const message = localStorage['adal.error.description'];

  if(error === 'access_denied') {
    return {ok: false, reason: 'access-denied', message};
  }

  return {ok: false, reason: 'login-error', error, message};
}

function getToken(authContext, resource) {
  return new Promise(resolve => {
    const loginResult = handleLogin(authContext);

    if(!loginResult.ok) {
      resolve(loginResult);
    }
    else {
      authContext.acquireToken(resource, (_, token, error) => {
        if(error) {
          if(error === 'invalid_resource') {
            resolve({ok: false, reason: 'invalid-resource', resource});
          }
          else {
            authContext.login();
            resolve({ok: false, reason: error});
          }
        }
        else {
          resolve(decode(token));
        }
      });
    }
  });
}

async function getTokenAndAddIdentity(authContext, resource) {
  const response = await getToken(authContext, resource);
  return addIdentity(response);
}

class DummyAuthenticationContext {
  constructor(config) {
    this.config = config;
  }

  login() {}

  acquireToken(resource, callback) {
    const response = this.config.tokenResponses[resource];

    if(response) {
      const { token, error } = response;
      callback(error, token, error);
    }

    throw new Error(`Unexpected token resource: ${resource}`);
  }
}

function buildAdalContext(config) {
  const authContext = AuthenticationContext.inject(config);
  window.AuthenticationContext = authContext;
  authContext.getUser(() => {});
  authContext.handleWindowCallback();
  setInterval(() => getToken(authContext,
                             this.authContext.config.clientId),
              60000);
  return authContext;
}

export function validateConfig(config) {
  config.expireOffsetSeconds = config.expireOffsetSeconds || 30;
  config.cacheLocation = config.cacheLocation || 'localStorage';
  config.redirectUri = config.redirectUri || window.location.origin;

  if(!config.extraQueryParameter) {
    if(config.domain) {
      config.extraQueryParameter = `nux=1&domain_hint=${config.domain}`;
    }
    else {
      config.extraQueryParameter = 'nux=1';
    }
  }

  if(config.tenantId) {
    struct.requiredString(config, 'auth config', 'tenantId');
    config.tenant = config.tenantId;
  }
  else if(config.tenantName) {
    struct.requiredString(config, 'auth config', 'tenantName');
    config.tenant = `${config.tenantName}.onmicrosoft.com`;
  }
  else if(config.tenant) {
    struct.requiredString(config, 'auth config', 'tenant');
    config.tenant = config.tenant;
  }

  struct.requiredStrings(config, 'auth config',
                         ['tenant', 'extraQueryParameter',
                          'redirectUri', 'cacheLocation']);
  struct.requiredInt(config, 'auth config', 'expireOffsetSeconds');

  return config;
}

/**
 * ADAL authentication and authorization client.
 *
 * Please reference tests for examples of usage.
 */
export default class AdalAuthClient {

  /**
   * Constructs an AdalAuthClient instance.
   *
   * Please avoid using this method directly. Use the factory method
   * AuthClient.build(config) instead.
   *
   * @param {AuthenticationContext} authContext - An AuthenticationClient
   * instance.
   */
  constructor(authContext) {
    this.authContext = authContext;
  }

  /**
   * Builds an AdalAuthClient using the options specified in config.
   *
   * Please avoid using this method directly. Use the factory method
   * AuthClient.build(config) instead.
   *
   * @param {object} config - A configuration object.
   * @returns {AdalAuthClient} AdalAuthClient instance.
   */
  static build(config) {
    arity(arguments, 1);

    struct.requiredString(config, 'auth config', 'clientId');

    let authContext;
    if(config.useDummyAuthenticationContext) {
      struct.requiredObject(config, 'auth config', 'tokenResponses');
      authContext = new DummyAuthenticationContext(config);

    }
    else {
      const validatedConfig = validateConfig(config);
      authContext = buildAdalContext(validatedConfig);
    }
    return new AdalAuthClient(authContext);
  }

  logOut() {
    this.authContext.logOut();
  }

  /**
   * Retrieves an access token for a given resource for the current user.
   *
   * @example
   * const response = await client.getAccessToken('https://foo.onmicrosoft.com/bar');
   *   success => {ok: true,
   *               token: "ABC123...",
   *               decodedToken: {...},
   *               name: "JONES, FRED",
   *               familyName: "JONES",
   *               givenName: "FRED",
   *               roles: ["ADMIN"]}
   *   error   => {ok: false, reason: "...", ...}
   *
   * @returns {Object} A response containing both the encoded and decoded
   * access token as well as any identity information present in the token's
   * claims when successful. Otherwise, an error response.
   */
  async getAccessToken(resource) {
    arity(arguments, 1);
    return getTokenAndAddIdentity(this.authContext, resource);
  }

  /**
   * Gets information about the currently logged in user.
   *
   * @example
   * const response = await client.getIdentityToken();
   *   success => {ok: true,
   *               token: "ABC123...",
   *               decodedToken: {...},
   *               name: "JONES, FRED",
   *               familyName: "JONES",
   *               givenName: "FRED",
   *               roles: ["ADMIN"]}
   *   error   => {ok: false, reason: "...", ...}
   *
   * @returns {Object} A response containing both the encoded and decoded
   * identity token as well as all identity information present in the token's
   * claims when successful. Otherwise, an error response.
   */
  async getIdentityToken() {
    arity(arguments, 0);
    return getTokenAndAddIdentity(this.authContext,
                                  this.authContext.config.clientId);
  }
}
