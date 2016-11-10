# graphql-http

A GraphQL client for executing queries over HTTP.

### DISCLAIMER

This library is not suitable for production use. If you're looking for a client
with similar functionality, see [Lokka](https://github.com/kadirahq/lokka). It
has much more support and is much more robust.

### Usage

```js
import { GQLClient } from 'graphql-http';

const client = GQLClient('http://localhost:3000', {
  fetch: {
    // anything passed here is merged with
    // the options passed to fetch()
    credentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
});
```

Queries

```js
client.query(`
  query ($id: RecordID!) {
    user(id: $id) {
      id
      name
    }
  }
`, { id: 1234 }).then((result) => {
  console.log(result.data.user);
  // => { id: 1234, name: ... }
});
```

Mutations

```js
client.mutate(`
  mutation ($id: RecordID!, $name: String!) {
    updateUser(input: {id: $id, name: $name}) {
      user {
        id
        name
      }
    }
  }
`, { id: 1234, name: 'Danny' }).then((result) => {
  console.log(result.data.user);
  // => { id: 1234, name: 'Danny' }
});
```
