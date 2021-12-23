# myadmin-geotab-api

Unofficial nodejs client for myadmin.geotab.com
https://myadmin.geotab.com/sdk#/api-reference

## 0.1.2 Notes

### Installation

Using npm:

```shell
$ npm i myadmin-geotab-api
```

Note: add --save if you are using npm < 5.0.0

### Getting Started

In Node.js:

Examples:

Using Async/Await Promises

```js
const MyAdminAPI = require('myadmin-geotab-api');

(async function main() {
	const username = 'user@domain.com';
	const password = '12345678';

	const api = new MyAdminAPI({
		username,
		password,
	});
	// Call authenticate method:<Promise>
	const authData = await api.authenticateAsync();

	// get user contacts
	const userContacts = await api.callAsync('GetUserContacts', {
		forAccount: authData.accounts[0].accountId,
	});

	console.log(userContacts);
})();
```

```js
const MyAdminAPI = require('myadmin-geotab-api');

(async function main() {
	const username = 'user@domain.com';

	//use apiKey and sessionId valids instead of password
	const apiKey = '0ff000ff-0000-0ff0-f00f-fff00f00000f';
	const sessionId = '00f0000f-0000-0fff-00f0-0fff0f00000f';

	//Use Test Environment
	//https://myadmin.geotab.com/sdk#/getting-started
	const uri = 'https://myadminapitest.geotab.com/v2/MyAdminApi.ashx';

	const api = new MyAdminAPI({
		username,
		apiKey,
		sessionId,
		uri,
	});

	// get user contacts
	const userContacts = await api.callAsync('GetUserContacts', {
		forAccount: authData.accounts[0].accountId,
	});

	console.log(userContacts);
})();
```

Using Promises then catch

```js
const MyAdminAPI = require('myadmin-geotab-api');

(function main() {
	const username = 'user@domain.com';
	const password = '12345678';

	const api = new MyAdminAPI({
		username,
		password,
	});
	// Call authenticate method:<Promise>
	api
		.authenticateAsync()
		.then((authData) =>
			api.callAsync('GetUserContacts', {
				forAccount: authData.accounts[0].accountId,
			})
		)
		.then((userContacts) => {
			console.log(userContacts);
		})
		.catch((err) => console.error(err));
})();
```



## 0.1.3+ Notes


### Installation

Using npm:

```shell
$ npm i https://github.com/DavidSabine/myadmin-geotab-api.git
```


### Getting Started


In Node.js:

Examples:

Using Async/Await Promises

```js
const MyAdminAPI = require('myadmin-geotab-api');

(async function main() {
	const username = 'user@domain.com';
	const password = '12345678';

	const api = new MyAdminAPI({
		username,
		password,
	});
	// Call authenticate method:<Promise>
	const authData = await api.authenticate();

	// get user contacts
	const userContacts = await api.call('GetUserContacts', {
		forAccount: authData.accounts[0].accountId,
	});

	console.log(userContacts);
})();
```

```js
const MyAdminAPI = require('myadmin-geotab-api');

(async function main() {
	const username = 'user@domain.com';

	//use apiKey and sessionId valids instead of password
	const apiKey = '0ff000ff-0000-0ff0-f00f-fff00f00000f';
	const sessionId = '00f0000f-0000-0fff-00f0-0fff0f00000f';

	//Use Test Environment
	//https://myadmin.geotab.com/sdk#/getting-started
	const uri = 'https://myadminapitest.geotab.com/v2/MyAdminApi.ashx';

	const api = new MyAdminAPI({
		username,
		apiKey,
		sessionId,
		uri,
	});

	// get user contacts
	const userContacts = await api.call('GetUserContacts', {
		forAccount: authData.accounts[0].accountId,
	});

	console.log(userContacts);
})();
```

Using Promises then catch

```js
const MyAdminAPI = require('myadmin-geotab-api');

(function main() {
	const username = 'user@domain.com';
	const password = '12345678';

	const api = new MyAdminAPI({
		username,
		password,
	});
	// Call authenticate method:<Promise>
	api
		.authenticate()
		.then((authData) =>
			api.call('GetUserContacts', {
				forAccount: authData.accounts[0].accountId,
			})
		)
		.then((userContacts) => {
			console.log(userContacts);
		})
		.catch((err) => console.error(err));
})();
```


### Upgrading from previous versions

If you are using 0.1.2 and wish to take advantage of this new version, note the following.


#### New method names are available, old method names still supported

We felt it redundant to use 'Async' in the function name. New method names are:

```js
.authenticate()
.call()
```

The old function names are still supported. You should not have to change any of your code.

```js
.authenticateAsync()
.callAsync()
```


#### .post() no longer throws errors, returns error message instead

As per this page, https://mswjs.io/docs/recipes/mocking-error-responses, the updated `post()` implementation treats an error response (from the fetch promise) as an actual response not an exception.

This is not likely to break your code — unless your code currently expects `post()` to throw an error/exception. We recommend you adjust to instead expect a JSON response that looks like:

```json
{
	result: {
		error: {
			code: an error code,
			message: an error message,
			name: a name of error, example: 'MissingMethodException'
		}
	}
}
```


### End note for contributors

Testing has been performed on node v14.
