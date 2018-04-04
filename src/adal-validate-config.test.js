import { validateConfig } from './adal';

test('should not require domain', async () => {
  const config = {clientType: "ADAL",
                  clientId: "ae33c32e-d2f2-4992-a4b2-51d03e7c8677",
                  tenantId: "c834c34e-bbd3-4ea1-c2c2-51daeff91aa32"};

  const validatedConfig = validateConfig(config);

  expect(validatedConfig).toEqual({
       "cacheLocation": "localStorage",
       "clientId": "ae33c32e-d2f2-4992-a4b2-51d03e7c8677",
       "clientType": "ADAL",
       "expireOffsetSeconds": 30,
       "extraQueryParameter": "nux=1",
       "redirectUri": "null",
       "tenant": "c834c34e-bbd3-4ea1-c2c2-51daeff91aa32",
       "tenantId": "c834c34e-bbd3-4ea1-c2c2-51daeff91aa32"
     });
});
