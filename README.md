# myadmin-geotab-api

Unofficial nodejs client for myadmin.geotab.com
https://myadmin.geotab.com/sdk#/api-reference


## Installation

Using npm:

```shell
$ npm i https://github.com/DavidSabine/myadmin-geotab-api.git
```


## Getting Started

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


## End note for contributors

Testing has been performed on node v14.


# Notes for users of previous version: <=0.1.2


## New method names are available, old method names still supported

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


## Improved error handling for `post()` method

This *may* break your previous code. And note that `post()` is used by `callAsync()`.

Previously, if something went wrong during the HTTP call to GeoTab's service, `post()` (and thus `callAsync()`) would *throw* an exception.

The new implementation differentiates between *internal and intended exceptions*. (See notes on this page, https://mswjs.io/docs/recipes/mocking-error-responses.) As per general guidance, the new implementation treats an error response (from the fetch promise) as an actual response not an exception.

If you implement `call()` or `post()` incorrectly, an exception will occur. But if you implement those methods correctly and something goes wrong during the HTTP call to GeoTab's server, you should now expect a JSON response with an error *message*. The JSON response looks like this:

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

See comments below:

```js
const MyAdminAPI = require('myadmin-geotab-api')

(function main() {
	const api = new MyAdminAPI({'a username','a password'})
	api
		.authenticate()
		.then(() =>
			api.call('A valid method', {'some':'parameters'})
		)
		.then((result) => {
			// GeoTab's service has important information for you
			console.log(result)
			// and if their service has responded with an error message
			if(result.error) {
				// you can handle it
				// it will have a code, a message, and a name
			}
		})
		.catch((err) => {
			// this module has thrown an error, maybe you did something wrong
			console.error(err)
		})
})()
```
