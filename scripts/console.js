#!/usr/bin/env node

var Brainfuck = require('../lib/Brainfuck.js')
/*
// @BUILD_START@
var Brainfuck = module.exports
/*-*/

var argv      = process.argv.slice(2),
    fs        = require('fs'),
    path      = require('path'),
    app       = "",
    appFile   = false,
		this_name = path.basename(process.argv[1]);
		
if(argv.length < 1) {
	bail(usage());
}

var options = {
	DEBUG: false,
	DEBUG_CALLBACK: debug_step,
	verbose: 0,
	validate: false,
}

for(var i = 0, l = argv.length; i < l ; i++) {
	switch(argv[i]) {
		case '-t'       :
		case '--test'  :
			options.validate = true;
			break;
		case '-i'       :
		case '--input'  :
		    options['input'] = argv[++i];
			break;
		case '-v'       :
		case '--version':
			options.verbose = 1;
			break;
		case '-vv'      :
		  options.verbose = 2;
		  break;
    case '-vvv'      :
  	  options.verbose = 3;
			options.DEBUG = true;
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
if(options.validate) {
	bail(validate(bf),0);
}
switch(options.verbose) {
	case 1:
		bail(version(bf),0);
		break;
	case 2:
		bf.compile();
		summary(bf,options);
		break;
	case 3:
		bf.options.DEBUG = true;
		bf.compile();
		summary(bf,options);
		break;
	default:
	  bf.compile();
}

bail(bf.buffer.output.concat('\n'));


function usage() {
	return '\n\
usage: bf [-vvv] [--test] [--input <string>] filename\n\
\n\
options: \n\
 -f, --file <file>   : Set filename to interpret\n\
 -i, --input <string>: Input string for application\n\
 -t, --test          : Validate syntax without executing application\n\
 -v, --version       : Print version information\n\
 -vv                 : Print summary of application\n\
 -vvv                : Print debug output on loop iterations\n\
\n';
}

function bail(m,c) {
	c = parseInt(c);
	process[ c>0 ? "stderr" : "stdout" ].write(m.concat("\n"));
	process.exit(c);
}

function summary(_bf,_o) {
	var mem = _bf.memory.map(function(num){ 
			var str = num.toString(16); 
			return str.length == 1 ? '0'.concat(str) : str;
		}).join(' ');
  process.stdout.write("\n".concat(
		"\n Application: ",_bf.application,
		"\n       Debug: ",_o.DEBUG.toString(),
		"\n      Memory: ",mem,"\n\n"
		));
}

function version(bf){
	return 'Brainfick.js v'.concat(bf.version,' (c) 2012 E. McConville <emcconville@emcconville.com>');
}

function validate(bf) {
	return 'Syntax '.concat(bf.validate() ? 'OK' : 'Error');
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