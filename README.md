# graphql-http

A GraphQL client for executing queries over HTTP.


### Usage

```javascript
import graphQLHTTP from 'graphql-http'

const client = graphQLHTTP('http://localhost:3000');

// Queries
let resultPromise = c.query('{ users { id, name }}');

// Mutations
let resultPromise = c.mutate('mutation {updateUser}');
```
