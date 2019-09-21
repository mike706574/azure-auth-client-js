import arity from './arity';
import jwtDecode from 'jwt-decode';

/**
 * Decodes a JWT.
 * @example
 * const response = decodeToken("ABC123");
 *   success => {ok: true, token: "ABC123", decodedToken: "..."}
 *   error   => {ok: false, token: "ABC123", error: {...}}
 * @returns {Object} A response containing both the token and the decoded token
 * if successful. Otherwise, an error response.
 */
export function decode(token) {
  arity(arguments, 1);

  try {
    return {ok: true, token, decodedToken: jwtDecode(token)};

  }
  catch(error) {
    return {ok: false, reason: 'invalid-token', token, error};
  }
}

/**
 * Adds identity information to a valid response.
 * @example
 * const identity = addIdentity({"ok": true,
 *                               "token": "ABC123",
 *                               "decodedToken": {"name": "JONES, FRED",
 *                                                "given_name": "FRED",
 *                                                ...}});
 *   => {...response, name: "JONES, FRED", givenName: "FRED", ...};
 * @returns {Object} The response with the added identity information.
 */
export function addIdentity(response) {
  arity(arguments, 1);
  if(response.ok) {
    const {name, family_name, given_name, roles} = response.decodedToken; // eslint-disable-line camelcase
    return {...response,
            name,
            familyName: family_name, // eslint-disable-line camelcase
            givenName: given_name, // eslint-disable-line camelcase
            roles};
  }
  return response;
}
