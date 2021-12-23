const MyAdminAPI = require('../index')
const server = require('../server-for-tests')


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

describe('MyAdminAPI.authenticate()', () => {
	const sut = new MyAdminAPI({
		...constructorProperties,
		username: process.env.GEOTAB_USERNAME,
		password: process.env.GEOTAB_PASSWORD
	})
	it('is a function', () => {
		expect(typeof sut.authenticate).toBe('function')
	})
	it('returns an object and sets the credentials', async () => {
		const authenticatedSUT = await sut.authenticate()
		expect(typeof authenticatedSUT).toBe('object')
		expect(sut.credentials).not.toEqual({
			...constructorProperties,
			username: process.env.GEOTAB_USERNAME,
			password: process.env.GEOTAB_PASSWORD
		})
		expect(sut.credentials.apiKey).not.toEqual('an apiKey')
		expect(sut.credentials.sessionId).not.toEqual('a session id')
	})
	it.skip('fails', () => {})
})

describe('MyAdminAPI.authenticateAsync()', () => {
	// this duplicates tests for .authenticate()
	// recommend remove in future version
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
	// this duplicates tests for .call()
	// recommend remove in future version
	const sut = new MyAdminAPI({
		...constructorProperties,
		username: process.env.GEOTAB_USERNAME,
		password: process.env.GEOTAB_PASSWORD
	})
	it('throws error when not provided a method name', async () => {
		await sut.authenticateAsync()
		expect(sut.callAsync(null, null)).rejects.toThrow('Must provide method.')
	})
	it('fetches "GetCountries" (a supported method without params)', async () => {
		await sut.authenticateAsync()
		expect(await sut.callAsync('GetCountries', null)).toEqual(expect.arrayContaining(['Canada', 'United States']))
	})
})

describe('MyAdminAPI.call()', () => {
	const sut = new MyAdminAPI({
		...constructorProperties,
		username: process.env.GEOTAB_USERNAME,
		password: process.env.GEOTAB_PASSWORD
	})
	it('throws error when not provided a method name', async () => {
		await sut.authenticateAsync()
		expect(sut.call(null, null)).rejects.toThrow('Must provide method.')
	})
	it('fetches "GetCountries" (a supported method without params)', async () => {
		await sut.authenticateAsync()
		expect(await sut.call('GetCountries', null)).toEqual(expect.arrayContaining(['Canada', 'United States']))
	})
	it.skip('fetches "a method" (a supported method with params)', () => {})
	it.skip('fails', () => {})
})

describe('MyAdminAPI.post(), can also be called directly (with credentials)', () => {
	const sut = new MyAdminAPI({
		...constructorProperties,
		username: process.env.GEOTAB_USERNAME,
		password: process.env.GEOTAB_PASSWORD
	})
	it('returns error message if missing method name (does not throw)', async () => {
		// this page https://mswjs.io/docs/recipes/mocking-error-responses
		// recommends by treating an error response as an actual response, 
		// and not an exception, you respect the standard and ensure your 
		// client code receives and handles a valid error response.
		await sut.authenticateAsync()
		const result = await sut.post('', {
			params: null,
			apiKey: sut.credentials.apiKey,
			sessionId: sut.credentials.sessionId,
    })
		expect(result.error.code).toBeUndefined()
		expect(result.error.name).toEqual('MissingMethodException')
		expect(result.error.message.indexOf('An error has occurred')).not.toEqual(-1)
	})
	it('fetches "GetCountries" (a supported method without params)', async () => {
		await sut.authenticateAsync()
		expect(await sut.post('GetCountries', {
      params: null,
      apiKey: sut.credentials.apiKey,
      sessionId: sut.credentials.sessionId,
    })).toEqual(expect.arrayContaining(['Canada', 'United States']))
	})
})
