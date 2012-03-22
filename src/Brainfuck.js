(function(){
	var Brainfuck = function(application, options){
		this.memory = [];
		this.pointer = 0;
		this.application = this.clean(application);
		this.buffer = this._buffer;
		this.options = this._options;
		return this.init(options);
	};
	Brainfuck.prototype = {
		_buffer : {
			input : "",
			output: ""
		},
		_options : {
			MEMORY_SIZE      : 30000,
			CELL_SIZE        : 255,
			USE_SIZE_LIMITS  : true,
			DEBUG            : false,
			DEBUG_CALLBACK   : function(){}
		},
		clean : function(str) {
			return str.replace(/\/\*(.*?)\*\//g,'')          // Remove classic code blocks
			          .replace(/(\/\/|\#|\:|\;)(.*?)$/g,'')  // Remove line comments
			          .replace(/[^\+\-\<\>\[\]\.\,]/g,'');   // Remove all illegal characters
		},
		compile : function() {
			for(var i = 0, l = this.application.length ; i < l ; i++) {
				if(isNaN(this.memory[this.pointer])) {
					this.memory[this.pointer] = 0;
				}
				switch(this.application.charCodeAt(i)) {
					case 43 : // +
						this.memory[this.pointer]++;
						if( this.options.USE_SIZE_LIMITS ) {
							this.memory[this.pointer] = this.memory[this.pointer] > this.options.CELL_SIZE ? 0 : this.memory[this.pointer];
						}
						break;
					case 45 : // -
						this.memory[this.pointer]--;
						if( this.options.USE_SIZE_LIMITS ) {
							this.memory[this.pointer] = this.memory[this.pointer] < 0 ? this.options.CELL_SIZE : this.memory[this.pointer];
						}
						break;
					case 62 : // >
						this.pointer++
						if( this.options.USE_SIZE_LIMITS ) {
							this.pointer = this.pointer > this.options.MEMORY_SIZE ? 0 : this.pointer;
						}
						break;
					case 60 : // <
						this.pointer--
						if( this.options.USE_SIZE_LIMITS ) {
							this.pointer = this.pointer < 0 ? this.options.MEMORY_SIZE : this.pointer;
						}
						break;
					case 91 : // [
						if(this.memory[this.pointer] == 0) {
							var _skip = 1;
							while(_skip > 0) {
								var _char = this.application.charCodeAt(++i);
								if(_char == 91) { _skip++; }
								else if(_char == 93) { _skip--; }
							}
						}
						break;
					case 93 : // ]
						var _o = i;
						var _back = 1;
						while(_back > 0) {
							var _char = this.application.charCodeAt(--i);
							if(_char == 91) { _back--; }
							else if (_char == 93 ) { _back++; }
						}
						i--;
						break;
					case 46 : // .
						this.write_output_buffer(this.memory[this.pointer]);
						break;
					case 44 : // ,
						this.memory[this.pointer] = this.read_input_buffer();
						break;
				}
			}
			return this.buffer.output;
		},
		init: function(opts) {
			if(typeof opts == 'string') {
				this.buffer.input = opts;
			} else {
				for(var _n in opts) {
					if ( /^input/.test(_n) ) {
						this.buffer.input.concat(opts[_n]);
					} else {
						this.options[_n.toUpperCase()] = opts[_n];
					}
				}
			}
			return this;
		},
		read_input_buffer : function() {
			var charCode = this.buffer.input.charCodeAt(0);
			this.buffer.input = this.buffer.input.substring(1,this.buffer.input.length);
			return charCode;
		},
		write_output_buffer : function(charCode) {
			var char = String.fromCharCode(charCode);
			this.buffer.output = this.buffer.output.concat(char);
			return char;
		},
	};
	
	if(typeof module !== 'undefined') {
		module.exports = Brainfuck;
	} else {
		this.Brainfuck = Brainfuck;
	}
})();

