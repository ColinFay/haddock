var http = require('http');
var shiny = require('./shinylauncher');

// list available ports
var available = [1234, 1235]
var port_server = 8080

shiny.launchShinyApps("prenomsapp::run_app()", available)

var server = http.createServer(function(req, res) {
	if (req.url != '/favicon.ico') {
		if (available.length == 0){
            shiny.noPort(
                res,
                title = "My Shiny App", 
                message = "No available port"
            )
		} else {
			var port = available.shift();
			shiny.logOpen(port, available)
            shiny.genPage(
                res,
                port,
                title = "My Shiny App", 
                port_server 
            );	
		}
    }
});


var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {

    socket.on('message', function (message) {
    	available.push(message)
    	shiny.logFree(message, available)
    }); 

});


server.listen(port_server);
