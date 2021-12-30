import MyAdminAPI from '../../src/index'
import server from '../__fixtures__/mock-service-worker'

const testWithLiveGeoTabSandbox_BypassTheMockServiceWorker = true
if(!testWithLiveGeoTabSandbox_BypassTheMockServiceWorker) {
	beforeAll(() => {
		server.listen()
	})
	afterAll(() => {
		server.close()
	})
	afterEach(() => {
		server.resetHandlers()
	})
} else {
	if(process.env.GEOTAB_USERNAME === undefined) {
		console.error(`Missing credentials.\n\nCreate .env file with your useranme and password assigned to GEOTAB_USERNAME and GEOTAB_PASSWORD variables.`)
	}
}

const username = (testWithLiveGeoTabSandbox_BypassTheMockServiceWorker && process.env.GEOTAB_USERNAME !== undefined) ? process.env.GEOTAB_USERNAME : `a username`
const password = (testWithLiveGeoTabSandbox_BypassTheMockServiceWorker && process.env.GEOTAB_PASSWORD !== undefined) ? process.env.GEOTAB_PASSWORD : `a password`

const constructorProperties = () => {
	return {
		password: password,
		uri: 'https://myadminapitest.geotab.com/v2/MyAdminApi.ashx',
		username: username
	}
}

const instantiateSUT = () => {
	return new MyAdminAPI({
		...constructorProperties(),
		password: password,
		username: username
	})
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
	it('requires a password', () => {
		expect(instantiateClass({
			...constructorProperties(),
			password: null,
		})).toThrow('Must supply password.')
	})
	it('requires a username', () => {
		expect(instantiateClass({
			...constructorProperties(),
			username: null
		})).toThrow('Must supply username.')
	})
	it('uses production url by default', () => {
		expect(new MyAdminAPI({
			...constructorProperties(),
			uri: null
		}).serverUrl).toEqual('https://myadminapi.geotab.com/v2/MyAdminApi.ashx')
	})
	it('uses given url', () => {
		expect(new MyAdminAPI({
			...constructorProperties(),
			uri: `any url`
		}).serverUrl).toEqual('any url')
	})
	it('uses given credentials', () => {
		expect(new MyAdminAPI(constructorProperties()).credentials).toEqual({
			apiKey: null,
			password: password,
			sessionId: null,
			username: username
		})
	})
})

let sut

describe('MyAdminAPI.authenticate()', () => {
	beforeEach(() => {
		sut = instantiateSUT()
	})	
	it('is a function', () => {
		expect(typeof sut.authenticate).toBe('function')
	})
	it('returns an object and sets the credentials', async () => {
		const authenticatedSUT = await sut.authenticate()
		expect(typeof authenticatedSUT).toBe('object')
		expect(sut.credentials.apiKey).not.toEqual(undefined)
		expect(sut.credentials.sessionId).not.toEqual(undefined)
		expect(sut.credentials.apiKey).not.toEqual(null)
		expect(sut.credentials.sessionId).not.toEqual(null)
	})
	it.skip('fails', () => {})
})

describe('MyAdminAPI.call()', () => {
	beforeEach(() => {
		sut = instantiateSUT()
	})
	it('throws error if not authenticated', async () => {
		expect(sut.call(null, null)).rejects.toThrow('Must authenticate() before using call().')
	})
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
	it('fetches "GetDevicePlans" (a supported method with params)', async () => {
		await sut.authenticate()
		expect(await sut.call('GetStates', { countryName: 'Canada' })).toEqual(
			expect.arrayContaining(['Alberta', 'British Columbia'])
		)
	})
	it.skip('fails', () => {})
})

describe('MyAdminAPI.post(), can also be called directly (with credentials)', () => {
	beforeEach(() => {
		sut = instantiateSUT()
	})
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
	sut = instantiateSUT()
	it('authenticateAsync() is still a usable function name', () => {
		expect(typeof sut.authenticateAsync).toBe('function')
	})
	it('callAsync() is still a usable function name', () => {
	 expect(typeof sut.callAsync).toBe('function')
	})
})
