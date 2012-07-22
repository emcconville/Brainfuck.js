module.exports = function(grunt) {
	grunt.initConfig({
		pkg : "<json:package.json>",
		meta : {
			shebang: '#!/usr/bin/env node\n',
			banner: "/*\n * <%= pkg.name %> v@<%= pkg.version %> (c) 2012 E. McConville <emcconville@emcconville.com>\n * Released under <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n */"
		},
		build : {
			"dist/bin/bf": 
			[
				"lib/Brainfuck.js",
				"scripts/console.js"
			]
		},
		clean : {
			"dist" : 
			[
				"bin/bf",
				"Brainfuck.min.js"
			]
		},
		min : {"dist/Brainfuck.min.js" : ["<banner>","lib/Brainfuck.js"]}
	});
	grunt.registerTask("default","clean build min");
	grunt.registerMultiTask("build","Assamble library and cli into application",function(){
		var lib = grunt.file.read(this.file.src[0]),
				cli = grunt.file.read(this.file.src[1]);
	    
		// Update version 
		lib = lib.replace(/@VERSION@/,grunt.config("pkg.version"));

		// Only include content after @BUILD_START@ flag
		cli = cli.replace(/^\#([\s\S]+?)@BUILD_START@\n/,"\n");

		// Write to dest file
		grunt.file.write(this.file.dest, "".concat(grunt.config("meta.shebang"),lib,cli) );
	});
	grunt.registerMultiTask("clean","Remove files generated by :build task",function(){
		var path = require('path'), fs = require('fs'), f = false;
			while(!!(f = this.data.shift()) ) {
				var res = path.resolve(path.join(this.file.dest,f));
				if(path.existsSync(res)) {
					try {
						fs.unlinkSync(res)
						grunt.log.write('+');
					} catch(er) {
						grunt.log.write('e');
					}
					
				} else {
					grunt.log.write('.');
				}
			}1
	});
};