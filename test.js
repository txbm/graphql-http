var client = require('./index.dist.js').default;


var c = client('http://localhost:3000');

var r = c.query('query { accounts { id, name }}');

console.log(r);
