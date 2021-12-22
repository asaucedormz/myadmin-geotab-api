const MyAdminAPI = require('../index')

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
		expect(instantiateClass()).toThrow('Cannot read property')
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

describe.only('MyAdminAPI.authenticateAsync()', () => {
	const sut = new MyAdminAPI(constructorProperties)
	it('is a function', () => {
		expect(typeof sut.authenticateAsync).toBe('function')
	})
	it.skip('returns an object and sets the credentials', async () => {
		const authenticatedSUT = await sut.authenticateAsync()
		expect(typeof authenticatedSUT).toBe('object')
		expect(sut.credentials).toEqual({})
	})
})
