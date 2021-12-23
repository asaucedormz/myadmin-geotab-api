const MyAdminAPI = require('../index')
const server = require('../mock-server')

const constructorProperties = {
	apiKey: 'an apiKey',
	password: 'a password',
	sessionId: 'a sessionId',
	uri: 'https://myadminapitest.geotab.com/v2/MyAdminApi.ashx',
	username: 'a username'
}

const sut = new MyAdminAPI({
	...constructorProperties,
	username: process.env.GEOTAB_USERNAME,
	password: process.env.GEOTAB_PASSWORD
})

// beforeAll(() => {
// 	server.listen()
// })

// afterAll(() => {
// 	server.close()
// })

// afterEach(() => {
// 	server.resetHandlers()
// })

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

describe('MyAdminAPI.call()', () => {
	it('throws error when not provided a method name', async () => {
		await sut.authenticate()
		expect(sut.call(null, null)).rejects.toThrow('Must provide method.')
	})
	it('fetches "GetCountries" (a supported method without params)', async () => {
		await sut.authenticate()
		expect(await sut.call('GetCountries', null)).toEqual(
			expect.arrayContaining(['Canada', 'United States'])
			)
	})
	it.only('fetches "GetDevicePlans" (a supported method with params)', async () => {
		const devicePlanParams = {
			forAccount: "fake-account-id-1234"
		}
		await sut.authenticate()
		expect(await sut.call('GetDevicePlans', devicePlanParams)).toEqual(
			expect.arrayContaining(
				["an id", "a level", true]
			)
		)
		expect(await sut.call('GetCountries', null)).toEqual(expect.arrayContaining(['Canada', 'United States']))
	})
	it.skip('fails', () => {})
})

describe('MyAdminAPI.post(), can also be called directly (with credentials)', () => {
	it('returns error message if missing method name (does not throw)', async () => {
		await sut.authenticate()
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
		await sut.authenticate()
		expect(await sut.post('GetCountries', {
      params: null,
      apiKey: sut.credentials.apiKey,
      sessionId: sut.credentials.sessionId,
    })).toEqual(expect.arrayContaining(['Canada', 'United States']))
	})
})

describe('MyAdminAPI still supports old method names', () => {
	it('authenticateAsync() is still a usable function name', () => {
		expect(typeof sut.authenticateAsync).toBe('function')
	})
	it('callAsync() is still a usable function name', () => {
		expect(typeof sut.callAsync).toBe('function')
	})
})
