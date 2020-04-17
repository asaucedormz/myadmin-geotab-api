const fetch = require('node-fetch');

class MyAdminAPI {
  constructor({
    username = null,
    password = null,
    apiKey = null,
    sessionId = null,
    uri = null,
  }) {
    if (!username) {
      throw new Error('Must supply username');
    }

    if (!password && !sessionId && !apiKey) {
      throw new Error('Must supply password OR sessionId and apiKey');
    }
    this.serverUrl = uri || 'https://myadminapi.geotab.com/v2/MyAdminApi.ashx';
    this.credentials = {
      username,
      password,
      apiKey,
      sessionId,
    };
  }

  async callAsync(method, params) {
    if (!method) {
      throw new Error('Must provide method');
    }
    if (!params) {
      params = {};
    }

    const result = await this.post(method, {
      ...params,
      apiKey: this.credentials.apiKey,
      sessionId: this.credentials.sessionId,
    });

    return result;
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

  async authenticateAsync() {
    if (!this.credentials.password) {
      throw new Error('Must supply password for authenticate');
    }
    const params = {
      username: this.credentials.username,
      password: this.credentials.password,
    };
    const result = await this.post('Authenticate', params);
    this.credentials.apiKey = result.userId;
    this.credentials.sessionId = result.sessionId;
    return result;
  }
}

module.exports = MyAdminAPI;
