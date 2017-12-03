import arity from './arity';
import {decode} from './common';

function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

async function sleepWhen(duration) {
  if(duration && duration > 0) {
    await sleep(duration);
  }
}

async function respond(response) {
  await sleepWhen(response.delay);
  const {token, error} = response;

  if(error) {
    return {ok: false, reason: error};
  }

  return decode(token);
}

/**
 * Dummy authentication and authorization client.
 *
 * Please reference tests for examples of usage.
 */
export default class DummyAuthClient {

  /**
   * Constructs an DummyAuthClient instance.
   *
   * Please avoid using this method directly. Use the factory method
   * AuthClient.build(config) instead.
   *
   * @param {object} data - An object for controlling delay times and
   * responses.
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Builds an DummyAuthClient using the options specified in config.
   *
   * Please avoid using this method directly. Use the factory method
   * AuthClient.build(config) instead.
   *
   * @param {object} config - A configuration object.
   * @returns {DummyAuthClient} DummyAuthClient instance.
   */
  static build(config) {
    return new DummyAuthClient(config);
  }

  /**
   * See adal/getAccessToken.
   */
  async getAccessToken(resource) {
    arity(arguments, 1);
    const responses = this.config.accessTokenResponses;
    if(responses) {
      const response = responses[resource];
      if(response) {
        return respond(response);
      }

      throw new Error(`No dummy access token response provided for resource ${resource}.`);
    }

    throw new Error('No dummy access token responses provided.');
  }

  /**
   * See adal/getIdentityToken.
   */
  async getIdentityToken() {
    arity(arguments, 0);
    await sleepWhen(this.config.identityDelay);
    const identity = this.config.identity;
    if(identity) {
      return {ok: true, ...identity};
    }
    return {ok: false, reason: 'no-dummy-identity'};
  }
}
