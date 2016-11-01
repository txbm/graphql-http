# graphql-http

A GraphQL client for executing queries over HTTP.


### Usage

```js
import { GQLClient } from 'graphql-http';

const client = GQLClient('http://localhost:3000', {
  // anything passed here is merged with
  // the options passed to fetch()
  credentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
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
