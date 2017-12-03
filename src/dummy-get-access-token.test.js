import DummyAuthClient from './dummy';

const INVALID_TOKEN = 'ABC123';

const VALID_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1MDkyMzM0NzUsImV4cCI6MTU0MDc2OTQ3NSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.SdoZIKv0cNZs6SS6EGTWVBRaeGm31rNztIC8jaLjg7o';

const VALID_TOKEN_DECODED = {"aud": "www.example.com", "exp": 1540769475, "iat": 1509233475, "iss": "Online JWT Builder", "sub": "jrocket@example.com"};

const RESOURCE = 'foo';

test('fetches valid access token', async () => {
  const TOKEN_RESPONSES = {};
  TOKEN_RESPONSES[RESOURCE] = {token: VALID_TOKEN};

  const config = {accessTokenResponses: TOKEN_RESPONSES};

  const client = DummyAuthClient.build(config);

  expect.assertions(3);

  const response = await client.getAccessToken(RESOURCE);

  expect(response.ok).toEqual(true);
  expect(response.token).toEqual(VALID_TOKEN);
  expect(response.decodedToken).toEqual(VALID_TOKEN_DECODED);
});

test('error when fetching access token', async () => {
  const TOKEN_RESPONSES = {};
  TOKEN_RESPONSES[RESOURCE] = {error: 'dummy-error'};

  const config = {accessTokenResponses: TOKEN_RESPONSES};

  const client = DummyAuthClient.build(config);

  expect.assertions(2);

  const response = await client.getAccessToken(RESOURCE);

  expect(response.ok).toEqual(false);
  expect(response.reason).toEqual('dummy-error');

  // TODO: Test that AuthenticationContext.login() doesn't get called.
});

test('invalid access token', async () => {
  const TOKEN_RESPONSES = {};
  TOKEN_RESPONSES[RESOURCE] = {token: INVALID_TOKEN};

  const config = {accessTokenResponses: TOKEN_RESPONSES};

  const client = DummyAuthClient.build(config);

  expect.assertions(3);

  const response = await client.getAccessToken(RESOURCE);

  expect(response.ok).toEqual(false);
  expect(response.reason).toEqual('invalid-token');
  expect(response.token).toEqual(INVALID_TOKEN);
});
