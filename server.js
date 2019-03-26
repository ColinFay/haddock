const http = require('http');
const shiny = require('./shinylauncher');
const YAML = require('yaml')
const fs = require('fs')
const file = YAML.parse(fs.readFileSync('./config.yml', 'utf8'))

// list available ports
var available = file["app"]["available"]
var port_server = file["app"]["port_server"] 

shiny.launchShinyApps(file["app"]["cmd"], available)

var server = http.createServer(function(req, res) {
	if (req.url != '/favicon.ico') {
		if (available.length == 0){
            shiny.noPort(
                res,
                title = file["app"]["title"], 
                message = file["app"]["no_port"]
            )
		} else {
			var port = available.shift();
			shiny.logOpen(port, available)
            shiny.genPage(
                res,
                port,
                title = file["app"]["title"], 
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
