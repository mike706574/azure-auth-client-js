import DummyAuthClient from './dummy';

test('fetches dummy identity', async () => {
  const config = {identity: {name: "JONES, FRED",
                             givenName: "FRED",
                             familyName: "JONES",
                             roles: ["ADMIN"]}};

  const client = DummyAuthClient.build(config);

  expect.assertions(5);

  const response = await client.getIdentityToken();

  expect(response.ok).toEqual(true);
  expect(response.name).toEqual("JONES, FRED");
  expect(response.givenName).toEqual("FRED");
  expect(response.familyName).toEqual("JONES");
  expect(response.roles).toEqual(["ADMIN"]);
});

test('no dummy identity provided', async () => {
  const config = {};

  const client = DummyAuthClient.build(config);

  expect.assertions(2);

  const response = await client.getIdentityToken();

  expect(response.ok).toEqual(false);
  expect(response.reason).toEqual('no-dummy-identity');
});
