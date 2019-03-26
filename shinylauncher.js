var exec = require('child_process').exec;
 
launchShiny = function(cmd, port) {
	var code = "R -e 'options(shiny.port = " + port + ");" + cmd + "'"
    var process = exec(code)
    return process
};

exports.launchShinyApps = function(cmd, available) {
	for (var i = 0; i < available.length; i++) { 
  		launchShiny(cmd, available[i]);
	}

};

exports.genPage = function(res, port_apps, title, port_server) {
	var txt = '<!DOCTYPE html>'+
			'<html>'+
			'    <head>'+
			'        <meta charset="utf-8" />'+
			'        <title>' + title + '</title>'+
			'    </head>'+ 
			'    <body>'+
			'     	<iframe id = "coolframe" src = "http://127.0.0.1:'+ port_apps +'" frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe>'+
			'<script src="/socket.io/socket.io.js"></script>' +
        	'<script>' + 
           	'	var socket = io.connect("http://localhost:' + port_server + '");' +
           	'	window.onbeforeunload = function (){' +
           	'		var x = document.querySelectorAll("iframe")[0].src;' +
           	'		var loc = new URL(x);' +
           	'		socket.emit("message", parseInt(loc.port));' +
			'	};' +
        	'</script>' +
			'    </body>'+
			'</html>'
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(txt);
	res.end();
	return res
};


 
exports.noPort = function(res, title, message) {
	res.writeHead(200, {"Content-Type": "text/html"});
	var txt = '<!DOCTYPE html>'+
			'<html>'+
			'    <head>'+
			'        <meta charset="utf-8" />'+
			'        <title>' + title + '</title>'+
			'    </head>'+ 
			'    <body>'+
			'		<p>'+ message + '</p>' +
			'    </body>'+
			'</html>';
	res.write(txt);
	res.end();
	res
};

exports.logFree = function(message, available) {
		console.log("    ")
        console.log('Freeing port: ' + message);
		console.log("--------")
		console.log("available :")
		console.log(available)
		console.log("--------")
};

exports.logOpen= function(port, available) {
		console.log("    ")
        console.log('Opening app at port: ' + port);
		console.log("--------")
		console.log("available :")
		console.log(available)
		console.log("--------")
};



