#!/usr/bin/env nodejs

var pShell = require('python-shell');

module.exports = function() { 
    this.connect = function(option, name, tvar, dist) {
			var options = {
			mode:'text',
			args:[option, name, tvar, dist]
		};
		
		pShell.run('connector.py', options, function(err, res) {
			if(err) throw err;
			return res;
		});
	};
}
//connect("suggest", "Nathan", 30, 500);
