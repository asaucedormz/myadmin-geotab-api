import axios from 'axios'

class MyAdminAPI {
	constructor({
		apiKey = null,
		password = null,
		sessionId = null,
		uri = null,
		username = null,
	}) {
		if (!password) {
			throw new Error('Must supply password.')
		}
		if (!username) {
			throw new Error('Must supply username.')
		}
		this.serverUrl = uri || 'https://myadminapi.geotab.com/v2/MyAdminApi.ashx'
		this.credentials = {
			apiKey,
			password,
			username,
			sessionId,
		}
	}
	async call(method, params = {}) {
		if (this.credentials.apiKey === null && this.credentials.sessionId === null) {
			throw new Error('Must authenticate() before using call().')
		}
		if (!method) {
			throw new Error('Must provide method.')
		}
		const response = await this.post(method, {
			...params,
			apiKey: this.credentials.apiKey,
			sessionId: this.credentials.sessionId,
		})
		return response
	}
	async authenticate() {
		const params = {
			username: this.credentials.username,
			password: this.credentials.password,
		}
		const response = await this.post('Authenticate', params)
		this.credentials.apiKey = response.userId
		this.credentials.sessionId = response.sessionId
		return response
	}
	async post(method, params) {
		const data = `JSON-RPC=${encodeURIComponent(JSON.stringify({
			id: -1,
			method,
			params,
		}))}`
		return await axios.post(
			this.serverUrl,
			data
			)
			.then(async (stream) => {
				const response = await stream
				if(response.data.error) {
					return {
						error: {
							code: response.data.error.code,
							message: response.data.error.message,
							name: response.data.error.errors[0].name
						}
					}
				} else {
					return response.data.result
				}
			}
			)
			.catch((error) => {
			return {
				error: {
					code: error.response.status,
					message: error.response.statusText,
					name: error.response.statusText
				}
			}
		})
	}
	async authenticateAsync() {
		return await authenticate()
	}
	async callAsync(method, params) {
		return await call(method, params)
	}
}

export default MyAdminAPI
