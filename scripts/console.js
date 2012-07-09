#!/usr/bin/env node

var argv      = process.argv.slice(2),
    fs        = require('fs'),
    path      = require('path'),
    app       = "",
    appFile   = false,
    Brainfuck = require('../lib/Brainfuck.js'),
		this_name = path.basename(process.argv[1]);
		
if(argv.length < 1) {
	bail(usage());
}

var options = {
	DEBUG: false,
	DEBUG_CALLBACK: debug_step
}

for(var i = 0, l = argv.length; i < l ; i++) {
	switch(argv[i]) {
		case '-d'       :
		case '--debug'  :
			options.DEBUG = true;
			break;
		case '-e'       :
		case '--eval'   :
			app = argv[++i];
			break;
		case '-i'       :
		case '--input'  :
		    options['input'] = argv[++i];
			break;
		case '-v'       :
		case '--verbose':
			options.verbose = true;
			break;
		case '-f'       :
		case '--file'   :
			appFile = argv[++i];
		default :
			if ( i == l-1 ) { // assume last argument it a file to read
				appFile = !!appFile ? appFile : argv[i];
			}
 			if (!!appFile && !/^\-+\w+$/.test(appFile)) {
				try { 
					app = fs.readFileSync(appFile,'ascii');
				} catch (err) {
					bail("Unable to open file: ".concat(appFile),1);
				}
			} else {
				bail("Unkown option flag: ".concat(argv[i]),1);
			}

	}
}

var bf = new Brainfuck(app,options);
options.hint = bf.application;
bf.compile();
if(options.verbose) {
	var mem = bf.memory.map(function(num){ 
			var str = num.toString(16); 
			return str.length == 1 ? '0'.concat(str) : str;
		}).join(' ');
  process.stdout.write("\n".concat(
		"\n Application: ",bf.application,
		"\n       Debug: ",options.DEBUG.toString(),
		"\n      Memory: ",mem,"\n"
		));
}
bail(bf.buffer.output.concat('\n'));


function usage() {
	return '\n\
usage: bf [--debug] [--verbose] [--input <string>]\n\
          [--eval <string>] [--file <path>] [path]\n\
\n\
options \n\
 -d, --debug         : Output debug info\n\
 -e, --eval <string> : Interprets string as application\n\
 -f, --file <file>   : Set filename to interpret\n\
 -i, input <string>  : Input string for application\n\
 -v, --verbose       : Output additional information\n\
                     : about application\n\
\n';
}

function bail(m,c) {
	c = parseInt(c);
	process[ c>0 ? "stderr" : "stdout" ].write(m.concat("\n"));
	process.exit(c);
}

function debug_step(flags,memory) {
	var line = "Step #".concat(flags.step);
	if(Math.abs(flags.cursor_start - flags.cursor_end) > 1) {
		line = line.concat(" ",(flags.cursor_start < flags.cursor_end ? "Skipping  to " : "Returning to "),flags.cursor_end," ");
		var padding = line.length + 4;
		line = line.concat(options.hint.substring(flags.cursor_end-4,flags.cursor_end+16));
		console.log(line);
		line = "";
		for(var i = 0; i< padding; i++) {
			line = line.concat(" ");
		}
		console.log(line.concat("^"));
		var mem = bf.memory.map(function(num,i){ 
				var str = num.toString(16); 
				str = str.length == 1 ? "0".concat(str) : str;
				return flags.pointer == i ? "[".concat(str,"]") : str;
			}).join(' ');
		var padding = "Memory".concat(flags.step.toString().replace(/\d/g," "),":");
		console.log(padding.concat(mem,"\n"));
		
	}
}