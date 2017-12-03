import AdalAuthClient from './adal';

const INVALID_TOKEN = 'ABC123';

const VALID_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJURVNUIiwiaWF0IjoxNTA5ODk0Mzg3LCJleHAiOjE1NDE0MzAzODcsImF1ZCI6Ind3dy5mb28uY29tIiwic3ViIjoiZnJlZEBmb28uY29tIiwiZ2l2ZW5fbmFtZSI6IkZSRUQiLCJmYW1pbHlfbmFtZSI6IkpPTkVTIiwibmFtZSI6IkpPTkVTLCBGUkVEIiwicm9sZXMiOlsiQURNSU4iLCJVU0VSIl19.3eJcGr7yyNuFrfL0iMD71m1pavUulHbZZfQ4lA7LMp4";

const VALID_TOKEN_DECODED = {
  "iss": "TEST",
  "iat": 1509894387,
  "exp": 1541430387,
  "aud": "www.foo.com",
  "sub": "fred@foo.com",
  "given_name": "FRED",
  "family_name": "JONES",
  "name": "JONES, FRED",
  "roles": [
    "ADMIN",
    "USER"
  ]
};

const CLIENT_ID = '123';

test('fetches valid identity token', async () => {
  global.localStorage = {'adal.error': ''};

  const TOKEN_RESPONSES = {};
  TOKEN_RESPONSES[CLIENT_ID] = {token: VALID_TOKEN};

  const config = {useDummyAuthenticationContext: true,
                  clientId: CLIENT_ID,
                  tokenResponses: TOKEN_RESPONSES};

  const client = AdalAuthClient.build(config);

  expect.assertions(7);

  const response = await client.getIdentityToken();

  expect(response.ok).toEqual(true);
  expect(response.token).toEqual(VALID_TOKEN);
  expect(response.decodedToken).toEqual(VALID_TOKEN_DECODED);
  expect(response.name).toEqual('JONES, FRED');
  expect(response.familyName).toEqual('JONES');
  expect(response.givenName).toEqual('FRED');
  expect(response.roles).toEqual(['ADMIN', 'USER']);
});


test('error fetching identity', async () => {
  global.localStorage = {'adal.error': ''};

  const TOKEN_RESPONSES = {};
  TOKEN_RESPONSES[CLIENT_ID] = {error: 'login required'};

  const config = {useDummyAuthenticationContext: true,
                  clientId: CLIENT_ID,
                  tokenResponses: TOKEN_RESPONSES};

  const client = AdalAuthClient.build(config);

  expect.assertions(2);

  const response = await client.getIdentityToken();

  expect(response.ok).toEqual(false);
  expect(response.reason).toEqual('login required');
});

test('access denied when fetching identity', async () => {
  global.localStorage = {'adal.error': 'access_denied'};

  const config = {useDummyAuthenticationContext: true,
                  clientId: CLIENT_ID,
                  tokenResponses: {}};

  const client = AdalAuthClient.build(config);

  expect.assertions(2);

  const response = await client.getIdentityToken();

  expect(response.ok).toEqual(false);
  expect(response.reason).toEqual('access-denied');
});

test('invalid identity token', async () => {
  global.localStorage = {'adal.error': ''};

  const TOKEN_RESPONSES = {};
  TOKEN_RESPONSES[CLIENT_ID] = {token: INVALID_TOKEN};

  const config = {useDummyAuthenticationContext: true,
                  clientId: CLIENT_ID,
                  tokenResponses: TOKEN_RESPONSES};

  const client = AdalAuthClient.build(config);

  expect.assertions(3);

  const response = await client.getIdentityToken();

  expect(response.ok).toEqual(false);
  expect(response.reason).toEqual('invalid-token');
  expect(response.token).toEqual(INVALID_TOKEN);
});
