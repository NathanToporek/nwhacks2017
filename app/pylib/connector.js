#!/usr/bin/env nodejs

var pShell = require('python-shell');

var global;

module.exports = { 
    connect : function(option, name, tvar, dist) {
			var options = {
			mode:'text',
			args:[option, name, tvar, dist]
		};
		//data = [];
		//pShell.on('message',  function(message) {
		//	data.push(message);
		//});
		pShell.run('./pylib/connector.py', options, function(err, res) {
			if(err) throw err;
			global = res;
			//console.log("reults: %j", res);
			//console.log("global: %j", global);	
		});
		return global;
	}
}

//connect("suggest", "Nathan", 30, 500);
