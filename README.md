# myadmin-geotab-api

Unofficial nodejs client for myadmin.geotab.com.

- https://myadmin.geotab.com/sdk#/api-reference


## Installation

Using yarn:

```shell
$ yarn add @davidsabine/myadmin-geotab-api
```

Using npm:

```shell
$ npm i @davidsabine/myadmin-geotab-api
```


## Getting Started

The order of operations is:

1. Import `myadmin-geotab-api` in your code.
```js
import MyAdminAPI from '@davidsabine/myadmin-geotab-api'
```

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
import MyAdminAPI from '@davidsabine/myadmin-geotab-api'

(async function main() {
	const username = process.env.YOURUSERNAME
	const password = process.env.YOURPASSWORD
	try	{
		const api = new MyAdminAPI({
			username,
			password,
			uri: 'https://myadminapitest.geotab.com/v2/MyAdminApi.ashx'
		})
		const authData = await api.authenticate()
		const result = await api.call(`GetCountries`, {})
		if(result.error) {
			console.log(result, `geotab responded with an error message`)
		} else {
			console.log(result, `the call was successful`)
		}
	} catch (error) {
		console.log(error, `an error was thrown in your code`)
	}
})()
```

Using Promises then catch

```js
import MyAdminAPI from '@davidsabine/myadmin-geotab-api'

(async function main() {
	const username = process.env.YOURUSERNAME
	const password = process.env.YOURPASSWORD
	const api = new MyAdminAPI({
		username,
		password,
		uri: 'https://myadminapitest.geotab.com/v2/MyAdminApi.ashx'
	})
	api
	.authenticate()
	.then(() => {
		console.log(`You are authenticated!`)
		api.call('GetCountries', {})
		.then((theListofCountries) => {
			console.log(theListofCountries, `the call was successful`)
		})
		.catch((err) => {
			console.log(err, `geotab responded with an error message`)
		})
	})
	.catch((err) => {
		console.log(err, `an error was thrown in your code`)
	})
})()
```

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

See error handling in examples above.
