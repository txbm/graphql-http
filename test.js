var client = require('./index.dist.js').default;


var c = client('http://localhost:3000');

c.query('{ accounts { id, name }}').then(function (r) {
  console.log(r);
});
