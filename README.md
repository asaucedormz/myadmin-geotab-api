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

The order of operations is:

1. Require `myadmin-geotab-api` in your code.

2. Create an instance of the class object:
	```js
	const myAPI = new MyAdminAPI({<authentication parameters here>})
	```

3. Tell that new instance to authenticate with GeoTab's server. This returns an object containing credentials, sessionId, apiKey, etc.
	```js
	myAPI.authenticate()
	```

4. Then use `myAPI.call()` to perform actions against GeoTab's service. The return values will vary depending which method name you send to GeoTab's service:
	```js
	myAPI.call(<a method name>, {<parameters related to that method>})
	```


Examples:

Using Async/Await Promises

```js
const MyAdminAPI = require('myadmin-geotab-api');

(async function main() {
	const username = 'your username'
	const password = 'your password'
	const testServerUrl = 'https://myadminapitest.geotab.com/v2/MyAdminApi.ashx'

	const api = new MyAdminAPI({
		username,
		password,
		testServerUrl // or omit to use prod
	})
	
	// Call authenticate method:<Promise>
	const authData = await api.authenticate()

	// get list of countries
	const countriesList = await api.call('GetCountries', {})

	console.log(countriesList)
})()
```

Using Promises then catch

```js
const MyAdminAPI = require('myadmin-geotab-api')

(function main() {
	const username = process.env.GEOTAB_USERNAME
	const password = process.env.GEOTAB_PASSWORD

	const api = new MyAdminAPI({
		username,
		password,
	})

	api
		.authenticate()
		.then(() =>
			api.call('GetCountries', {})
		)
		.then((countriesList) => {
			console.log(countriesList)
		})
		.catch((err) => console.error(err))
})()
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

Examples:

Receive error message from GeoTab's server

```js
const MyAdminAPI = require('myadmin-geotab-api')

(() => {
	const username = process.env.GEOTAB_USERNAME
	const password = process.env.GEOTAB_PASSWORD

	const api = new MyAdminAPI({
		username,
		password,
		uri: 'https://myadminapitest.geotab.com/v2/MyAdminApi.ashx'
	})

	api
		.authenticate()
		.then((result) =>
			api.call('Wrong Method', { 'wrong': 'parameter' })
		)
		.then((result) => {
			// The error message from GeoTab server is in the result
			console.log(result)
		})
		.catch((err) => console.error(err))
})()
```

Catch error in your code

```js
const MyAdminAPI = require('myadmin-geotab-api')

(() => {
	const username = process.env.GEOTAB_USERNAME
	const password = process.env.GEOTAB_PASSWORD

	const api = new MyAdminAPI({
		username,
		password,
		uri: 'https://myadminapitest.geotab.com/v2/MyAdminApi.ashx'
	})

	api
		.authenticate()
		.then((result) =>
			api.WRONG('you did something wrong')
		)
		.then((result) => {
			// Error occured before http fetch could happen
			// so, no result is available
			console.log(result)
		})
		.catch((err) => {
			// thrown error is available here
			console.error(err)
		})
})()
```
