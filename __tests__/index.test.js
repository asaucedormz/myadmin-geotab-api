const MyAdminAPI = require('../index')
const rest = require('msw').rest
const setupServer = require('msw/node').setupServer

const server = setupServer(
	rest.post('https://myadminapitest.geotab.com/v2/MyAdminApi.ashx', (req, res, ctx) => {
		return res(
			ctx.status(200), 
			ctx.json({
				result: {
					accounts: [
					  {
					    accountId: 'ACCOUNT01',
					    currency: {
					      code: 'CAD',
					      name: 'Canadian Dollars',
					    },
					  },
					  {
					  accountId: 'ACCOUNT02',
					  currency: {
					    code: 'USD',
					    name: 'US Dollars',
					    },
					  },
					],
					name: 'a name',
					roles: [
					  {
					    comments: 'a comment',
					    name: 'a role name',
					  },
					],
					sessionId: 'a session Id',
					userId: 'a userId',
				}
			})
		)
	})
)

beforeAll(() => {
	server.listen()
})

afterAll(() => {
	server.close()
})

afterEach(() => {
	server.resetHandlers()
})

const constructorProperties = {
	apiKey: 'an apiKey',
	password: 'a password',
	sessionId: 'a sessionId',
	uri: 'https://myadminapitest.geotab.com/v2/MyAdminApi.ashx',
	username: 'a username'
}

describe('MyAdminAPI constructor', () => {
	const instantiateClass = (obj) => {
		return () => {
			return new MyAdminAPI(obj)
		}
	}
	it('requires an object', () => {
		expect(instantiateClass()).toThrow('Cannot')
		expect(instantiateClass({})).toThrow('Must supply')
	})
	it('requires an apiKey', () => {
		expect(instantiateClass({
			...constructorProperties,
			apiKey: null,
		})).toThrow('Must supply apiKey.')
	})
	it('requires a password', () => {
		expect(instantiateClass({
			...constructorProperties,
			password: null,
		})).toThrow('Must supply password.')
	})
	it('requires a sessionId', () => {
		expect(instantiateClass({
			...constructorProperties,
			sessionId: null,
		})).toThrow('Must supply sessionId.')
	})
	it('requires a username', () => {
		expect(instantiateClass({
			...constructorProperties,
			username: null
		})).toThrow('Must supply username.')
	})
	it('uses production url by default', () => {
		expect(new MyAdminAPI({
			...constructorProperties,
			uri: null
		}).serverUrl).toEqual('https://myadminapi.geotab.com/v2/MyAdminApi.ashx')
	})
	it('uses given url', () => {
		expect(new MyAdminAPI({
			...constructorProperties,
			uri: `any url`
		}).serverUrl).toEqual('any url')
	})
	it('uses given credentials', () => {
		expect(new MyAdminAPI(constructorProperties).credentials).toEqual({
			apiKey: 'an apiKey',
			password: 'a password',
			sessionId: 'a sessionId',
			username: 'a username'
		})
	})
})

describe('MyAdminAPI.authenticateAsync()', () => {
	const sut = new MyAdminAPI({
		...constructorProperties,
		username: process.env.GEOTAB_USERNAME,
		password: process.env.GEOTAB_PASSWORD
	})
	it('is a function', () => {
		expect(typeof sut.authenticateAsync).toBe('function')
	})
	it('returns an object and sets the credentials', async () => {
		const authenticatedSUT = await sut.authenticateAsync()
		expect(typeof authenticatedSUT).toBe('object')
		expect(sut.credentials).not.toEqual({
			...constructorProperties,
			username: process.env.GEOTAB_USERNAME,
			password: process.env.GEOTAB_PASSWORD
		})
		expect(sut.credentials.apiKey).not.toEqual('an apiKey')
		expect(sut.credentials.sessionId).not.toEqual('a session id')
	})
})

describe('MyAdminAPI.callAsync()', () => {
	const sut = new MyAdminAPI({
		...constructorProperties,
		username: process.env.GEOTAB_USERNAME,
		password: process.env.GEOTAB_PASSWORD
	})
	it('throws error when not provided a method name', async () => {
		await sut.authenticateAsync()
		expect(sut.callAsync(null, null)).rejects.toThrow('Must provide method.')
	})
})
