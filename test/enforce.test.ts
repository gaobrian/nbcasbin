import { newModel, newEnforcer, Enforcer, StringAdapter, Util } from '../src';
import { ip }  from '../src/util/ip';

async function testEnforce(e: Enforcer, sub: any, obj: string, act: string, res: boolean): Promise<void> {
  await expect(e.enforce(sub,'domain', obj, act)).resolves.toBe(res);
}


const model = `
[request_definition]
r = sub, dom, obj, act

[policy_definition]
p = sub, dom, obj, act

[role_definition]
g = _, _, _
g2 = _, _, _
[policy_effect]
e = some(where(p.eft== allow))

[matchers]
m = g(r.sub, p.sub, r.dom) && g2(r.obj, p.obj, r.dom) && r.act == p.act && r.dom == p.dom || r.sub == 'phb' || r.sub == 'test_yw'
`

const policy = `
p, tt, domain, /cassbackend/backendApi, GET, allow
p, tt, domain, /cassbackend/backendApi, POST, allow
p, tt, domain, /cassbackend/backendApi, PUT, allow
p, tt, domain, /cassbackend/backendApi, DELETE, allow
p, tt, domain, /cassbackend/backendApi/isAvailableName, GET, allow
p, tt, domain, /cassbackend/backendServer, DELETE, allow
p, tt, domain, /cassbackend/backendServer, POST, allow
p, tt, domain, /cassbackend/backendServer, PUT, allow
p, tt, domain, /cassbackend/gapi/syncServer, PUT, allow
p, tt, domain, /cassbackend/gapi/syncApiByServerId, PUT, allow
g, luozj , tt , domain
`

test('TestModelInMemory', async () => {
  const e = await newEnforcer(model, policy);

  await testEnforce(e, 'luozj', '/cassbackend/backendApi', 'GET', true);
  await testEnforce(e, 'luozj', '/cassbackend/backendApi', 'POST', true);
  await testEnforce(e, 'luozj', '/cassbackend/backendApix', 'POST', false);
  await testEnforce(e, 'luozj', '/cassbackend/backendApi', 'PUT', true);
  await testEnforce(e, 'luozj', '/cassbackend/backendApi', 'DELETE', true);
  await testEnforce(e, 'luozj', '/cassbackend/backendApi/isAvailableName', 'GET', true);
  await testEnforce(e, 'luozj', '/cassbackend/backendServer', 'DELETE', true);
  await testEnforce(e, 'luozj', '/cassbackend/backendServer', 'POST', true);
  await testEnforce(e, 'luozj', '/cassbackend/backendServer', 'PUT', true);
  await testEnforce(e, 'luozj', '/cassbackend/gapi/syncServer', 'PUT', true);
  await testEnforce(e, 'luozj', '/cassbackend/gapi/syncApiByServerId', 'PUT', true);
  await testEnforce(e, 'luozj', '/cassbackend/gapi/syncApiByServerId', 'GET', false);
  await testEnforce(e, 'luozj', '/cassbackend/gapi/syncApiByServerId', 'POST', false);
  await testEnforce(e, 'luozj', '/cassbackend/gapi/syncApiByServerIdx', 'POST', false);
  await testEnforce(e, 'luozjx', '/cassbackend/gapi/syncApiByServerId', 'POST', false);
});

test('TestModelFile', async () => {
  console.log(ip.toBuffer("1.1.1.1"));
});