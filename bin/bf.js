#!/usr/bin/env node

var argv      = process.argv.slice(2),
    fs        = require('fs'),
    app       = "",
	appFile   = false,
    Brainfuck = require('../src/Brainfuck.js');
if(argv.length < 1) {
	process.stdout.write('\
 bf.js [options] filename\n\
 bf.js [options] -e string\n\
');
}

var options = {
	show_memory : false,
	DEBUG: false,
	DEBUG_CALLBACK: function(flags,memory){
		
	}
}

for(var i = 0, l = argv.length; i < l ; i++) {
	switch(argv[i]) {
		case '-d':
		case '--debug':
			options.DEBUG = true;
			break;
		case '-e' :
		case '--eval' :
			app = argv[++i];
			break;
		case '-i':
		case '--input':
		    options['input'] = argv[++i];
			break;
		case '-v' :
		case '--verbose':
			options.verbose = true;
			break;
		case '-f':
		case '--file':
			appFile = argv[++i];
		default :
			if ( i == l-1 ) { // assume last argument it a file to read
				appFile = !!appFile ? appFile : argv[i];
			}
 			if (!!appFile && !/^\-+\w+$/.test(appFile)) {
				try { 
					app = fs.readFileSync(appFile,'ascii');
				} catch (err) {
					console.error("Unable to open file: %s",appFile);
					process.exit(1);
				}
			} else {
				console.error("Unkown option flag: %s",argv[i]);
				process.exit(1);
			}

	}
}

var bf = new Brainfuck(app,options);
bf.compile();
if(options.verbose) {
	var mem = bf.memory.map(function(num){ 
			var str = num.toString(16); 
			return str.length == 1 ? '0'.concat(str) : str;
		}).join(' ');
	process.stdout.write('\n+-----------+');
	process.stdout.write('\n Application: '.concat(bf.application));
	process.stdout.write('\n       Debug: '.concat(options.DEBUG.toString()));
	process.stdout.write('\n      Memory: '.concat(mem));
	process.stdout.write('\n+-----------+');
	process.stdout.write('\n');
}
process.stdout.write(bf.buffer.output.concat('\n'));
process.exit();