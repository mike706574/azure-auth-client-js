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

test('uses dummy identity token', async () => {
  const config = {identityToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpPTkVTLCBGUkVEIiwiZmFtaWx5X25hbWUiOiJKT05FUyIsImdpdmVuX25hbWUiOiJGUkVEIiwicm9sZXMiOlsiQURNSU4iXSwiaWF0IjoxNTE2MjM5MDIyfQ.IfakCBAhIYgkUU12-bRK4r6Boo2FVuW1kd9POylK"};

  const client = DummyAuthClient.build(config);

  expect.assertions(5);

  const response = await client.getIdentityToken();

  expect(response.ok).toEqual(true);
  expect(response.name).toEqual("JONES, FRED");
  expect(response.givenName).toEqual("FRED");
  expect(response.familyName).toEqual("JONES");
  expect(response.roles).toEqual(["ADMIN"]);
});


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
