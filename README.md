# myadmin-geotab-api

Unofficial nodejs client for myadmin.geotab.com
https://myadmin.geotab.com/sdk#/api-reference

## A note on tests

These are run on node v14, and should also work up to v15. You may run into breaking changes in the test on v17 and above or 14 and below

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
