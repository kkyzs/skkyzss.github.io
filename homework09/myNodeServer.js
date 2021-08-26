var express = require('express');
var server = express();
var port = process.argv[2]

// Use www as the "root" directory for all requests.
// if no path is given, it will look for index.html in that directoy.
server.use(express.static('www'));

// Start the server listening on a port
server.listen(port, function(){
	console.log ("server listening on port " + port);
});

