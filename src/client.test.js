import AuthClient from './client';
import AdalAuthClient from './adal';
import DummyAuthClient from './dummy';

test('no auth config when building', async () => {
  expect(() => AuthClient.build({}))
    .toThrowError(/Expected either a config object containing an azureAuthConfig property OR an auth config object, but got neither./);
});

test('missing clientType when building', async () => {
  expect(() => AuthClient.build({azureAuthConfig: {}}))
    .toThrowError(/Missing required auth config property: clientType/);
});

test('invalid clientType when building', async () => {
  expect(() => AuthClient.build({azureAuthConfig: {clientType: 'foo'}}))
    .toThrowError(/Unsupported AuthClient type: foo/);
});

test('missing clientId when building ADAL client', async () => {
  expect(() => AuthClient.build({azureAuthConfig: {clientType: 'ADAL'}}))
    .toThrowError(/Missing required auth config property: clientId/);
});

const ADAL_CONFIG = {clientType: 'ADAL',
                     clientId: 'acd2d142-c42a-2b86-ae3a-c4ed20ec867',
                     tenantName: 'foo',
                     domain: 'foo.com',
                     skipAuthenticationContextConstructor: true};

test('builds ADAL client from config object', async () => {
  const client = AuthClient.build({azureAuthConfig: ADAL_CONFIG});
  expect(client instanceof AdalAuthClient).toBeTruthy();
});

test('builds ADAL client from auth config object', async () => {
  const client = AuthClient.build(ADAL_CONFIG);
  expect(client instanceof AdalAuthClient).toBeTruthy();
});

test('builds dummy client', async () => {
  const client = AuthClient.build({azureAuthConfig: {clientType: 'DUMMY'}});
  expect(client instanceof DummyAuthClient).toBeTruthy();
});
