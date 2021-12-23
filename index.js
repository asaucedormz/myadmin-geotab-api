const fetch = require('node-fetch')

class MyAdminAPI {
  constructor({
    apiKey = null,
    password = null,
    sessionId = null,
    uri = null,
    username = null,
  }) {
		if (!apiKey) {
			throw new Error('Must supply apiKey.')
		}
		if (!password) {
			throw new Error('Must supply password.')
		}
		if (!sessionId) {
		  throw new Error('Must supply sessionId.')
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
  async call(method, params = {}) {
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
  async post(method, params) {
    const body = JSON.stringify({
      id: -1,
      method,
      params,
    })
    const data = await fetch(this.serverUrl, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
    if (data.error) {
			return {
				error: {
					code: data.error.code,
					message: data.error.message,
					name: data.error.errors[0].name
				}
			}
    }
    return data.result
  }
	// these methods were renamed and retained here
	// for backwards compatibility.
	// recommend remove in future version.
	async authenticateAsync() {
		return await this.authenticate();
  }
	async callAsync(method, params = {}) {
		return await this.call(method, params);
	}
}

module.exports = MyAdminAPI
