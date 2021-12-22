const fetch = require('node-fetch');

class MyAdminAPI {
  constructor({
    apiKey = null,
    password = null,
    sessionId = null,
    uri = null,
    username = null,
  }) {
		if (!apiKey) {
			throw new Error('Must supply apiKey.');
		}
		if (!password) {
			throw new Error('Must supply password.');
		}
		if (!sessionId) {
		  throw new Error('Must supply sessionId.');
		}
    if (!username) {
      throw new Error('Must supply username.');
    }
    this.serverUrl = uri || 'https://myadminapi.geotab.com/v2/MyAdminApi.ashx';
    this.credentials = {
      apiKey,
      password,
      username,
      sessionId,
    };
  }
  async authenticateAsync() {
    const params = {
      username: this.credentials.username,
      password: this.credentials.password,
    };
    const response = await this.post('Authenticate', params);
    this.credentials.apiKey = response.userId;
    this.credentials.sessionId = response.sessionId;
    return response;
  }
  async callAsync(method, params) {
    if (!method) {
      throw new Error('Must provide method');
    }
    if (!params) {
      params = {};
    }

    const response = await this.post(method, {
      ...params,
      apiKey: this.credentials.apiKey,
      sessionId: this.credentials.sessionId,
    });

    return response;
  }
  async post(method, params) {
    const body = JSON.stringify({
      id: -1,
      method,
      params,
    });
    const data = await fetch(this.serverUrl, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());

    if (data.error && data.error.errors) {
      const error = new Error(data.error.message);
      error.name = data.error.errors[0].name;
      error.code = data.error.code;
      throw error;
    }
    return data.result;
  }
}

module.exports = MyAdminAPI;
