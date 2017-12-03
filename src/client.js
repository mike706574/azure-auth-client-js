import * as struct from './struct';
import AdalAuthClient from './adal';
import DummyAuthClient from './dummy';

const CONFIG_KEY = 'azureAuthConfig';

const CLIENT_TYPE_KEY = 'clientType';

export default class AuthClient {
  /**
   * Builds an Auth client instance.
   *
   * @param {object} config - A global application configuration object.
   * @returns {AuthClient} AuthClient instance.
   */
  static build(config) {
    let azureAuthConfig;

    if(config[CONFIG_KEY]) {
      azureAuthConfig = config[CONFIG_KEY];
      struct.assertObject(azureAuthConfig, 'config', CONFIG_KEY);
    }
    else if(config[CLIENT_TYPE_KEY]) {
      azureAuthConfig = config;
    }
    else {
      throw new Error('Expected either a config object containing an ' +
                      'azureAuthConfig property OR an auth config object, but ' +
                      'got neither.');
    }

    const clientType = struct.requiredString(azureAuthConfig,
                                             'auth config',
                                             CLIENT_TYPE_KEY),
          clientTypeKey = clientType.toUpperCase();

    if(clientTypeKey === 'ADAL') {
      return AdalAuthClient.build(azureAuthConfig);
    }

    if(clientTypeKey === 'DUMMY') {
      return DummyAuthClient.build(azureAuthConfig);
    }

    throw new Error(`Unsupported AuthClient type: ${clientType}`);
  }
}
