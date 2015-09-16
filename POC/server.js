var americano = require('americano');
var daemon = require('./daemon')

var port = process.env.PORT || 9250;
americano.start({name: 'template', port: port});


