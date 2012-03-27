(function(){
	var Brainfuck = function(application, options){
		this.application = "";
		this.buffer = { input : "", output: "" };
		this.cursor = 0;
		this.memory = [];
		this.options = this._options;
		this.pointer = 0;
		return this.init(application,options);
	};
	Brainfuck.prototype = {
		_debug_flags : {
			step:-1,
			pointer_start:0,
			pointer_end:0
		},
		_options : {
			MEMORY_SIZE      : 30000,
			CELL_SIZE        : 255,
			USE_SIZE_LIMITS  : true,
			DEBUG            : false,
			DEBUG_CALLBACK   : function(){},
			LANGUAGE         : {
				INCREMENT      : 43, // +
				DECREMENT      : 45, // -
				POINTER_NEXT   : 62, // >
				POINTER_PREV   : 60, // <
				WHILE_BEGIN    : 91, // [
				WHILE_END      : 93, // ]
				OUTPUT         : 46, // .
				INPUT          : 44  // ,
			}
		},
		clean : function(str) {
			var s = '[^';
			for(var i in this.options.LANGUAGE) {
				var c = this.options.LANGUAGE[i].toString(16);
				s = s.concat('\\x',c);
			}
			s = s.concat(']');
			var reg = new RegExp(s,'g');
			return str.replace(/\/\*(.|\n|\r)*?\*\//mg,'')         // Remove classic code blocks
			          .replace(/(\/\/|\#|\;)(.*?)$/g,'')  // Remove line comments
			          .replace(reg,'');                      // Remove all illegal characters
		},
		compile : function() {
			for(this.cusror = 0, l = this.application.length ; this.cursor < l ; this.cursor++) {
				
				// Check if cell exists, and initialize (set to zero) if NAN
				this.memory[this.pointer] = isNaN(this.memory[this.pointer]) ? 0 : this.memory[this.pointer];
				
				if(this.options.DEBUG) {
					var debug_flags = !!debug_flags ? debug_flags : this._debug_flags;
					debug_flags.step++;
					debug_flags.pointer_start = debug_flags.pointer_end = this.pointer;
					debug_flags.cursor_start  = debug_flags.cursor_end  = this.cursor;
				}
				
				switch(this.application.charCodeAt(this.cursor)) {
					case this.options.LANGUAGE.INCREMENT :
						this.memory[this.pointer]++;
						if( this.options.USE_SIZE_LIMITS && this.memory[this.pointer] > this.options.CELL_SIZE) {
							this.memory[this.pointer] = 0;
						}
						break;
					case this.options.LANGUAGE.DECREMENT :
						this.memory[this.pointer]--;
						if( this.options.USE_SIZE_LIMITS && this.memory[this.pointer] < 0 ) {
							this.memory[this.pointer] = this.options.CELL_SIZE;
						}
						break;
					case this.options.LANGUAGE.POINTER_NEXT :
						this.pointer++
						if( this.options.USE_SIZE_LIMITS && this.pointer > this.options.MEMORY_SIZE ) {
							this.pointer = 0;
						}
						break;
					case this.options.LANGUAGE.POINTER_PREV :
						this.pointer--
						if( this.options.USE_SIZE_LIMITS && this.pointer < 0 ) {
							this.pointer = this.options.MEMORY_SIZE;
						}
						break;
					case this.options.LANGUAGE.WHILE_BEGIN :
						if(this.memory[this.pointer] == 0) {
							var _skip = 1;
							while( _skip > 0 ) {
								var _char = this.application.charCodeAt(++this.cursor);
								if( _char == this.options.LANGUAGE.WHILE_BEGIN ) { _skip++; }
								else if( _char == this.options.LANGUAGE.WHILE_END ) { _skip--; }
							}
						}
						break;
					case this.options.LANGUAGE.WHILE_END :
						var _back = 1;
						while( _back > 0 ) {
							var _char = this.application.charCodeAt(--this.cursor);
							if( _char == this.options.LANGUAGE.WHILE_BEGIN ) { _back--; }
							else if ( _char == this.options.LANGUAGE.WHILE_END ) { _back++; }
						}
						this.cursor--;
						break;
					case this.options.LANGUAGE.OUTPUT  :
						this.write_output_buffer(this.memory[this.pointer]);
						break;
					case this.options.LANGUAGE.INPUT : // ,
						this.memory[this.pointer] = this.read_input_buffer();
						break;
				}

				if(this.options.DEBUG) {
					debug_flags.pointer_end = this.pointer;
					debug_flags.cursor_end  = this.cursor+1;
					this.options.DEBUG_CALLBACK(debug_flags,this.memory);
				}

			}
			return this.buffer.output;
		},
		init: function(application,opts) {
			if(typeof opts == 'string') {
				this.buffer.input = opts;
			} else {
				for(var _n in opts) {
					if ( /^input/.test(_n) ) {
						this.buffer.input = this.buffer.input.concat(opts[_n]);
					} else {
						this.options[_n.toUpperCase()] = opts[_n];
					}
				}
			}
			this.application = this.clean(application);
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

