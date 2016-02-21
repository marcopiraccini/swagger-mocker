var Hapi = require('hapi');
var path = require('path');

var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: <%= port %>
});

server.register({
    register: require('./swagger-plugin'),
    options: {
        api: '<%= swaggerApi %>',
        handlers: path.join(__dirname, './handlers'),
        cors: true
    }
}, function (err) {
  if (err) console.log("ERR", err)
});


// Start the server
server.start( function (err) {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
