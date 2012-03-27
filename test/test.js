var Brainfuck = require('../');
var test = require('tap').test;


test("Hello World!",function(t){
  var app = '                                                                     \
  >+++++++++[<++++++++>-]<.>+++++++[<++++>-]<+.+++++++..+++.[-]>++++++++[<++++>-] \
  <.>+++++++++++[<+++++>-]<.>++++++++[<+++>-]<.+++.------.--------.[-]>++++++++[  \
  <++++>-]<+.[-]++++++++++.                                                       \
  ';
	var bf = new Brainfuck(app);
	t.equal(bf.compile(),"Hello World!\n","Output should be Hello World! with a new line");
	t.end();
});

test("Clean Code!",function(t){
  var bf = new Brainfuck('not an app');
	/*
		Comment Block
	*/
	var blockComment = '                            \
	/**\n                                           \
	 * This is a block comment with example code\n  \
	 * @example ++++++[-]\n                         \
	 */\n                                           \
	+-+-+-++[-]                                     \
';
  t.equal('+-+-+-++[-]',bf.clean(blockComment),"Comment block");

	/*
		Comment Line
	*/
	var lineComment = '                             \
	+++++            // Count to five\n             \
	[                // Start loop\n                \
	  >++            // Move to right & add 2\n     \
	  <-             // Return and decrement\n      \
	]                \n                             \
	>[-]             // Clear ceil\n                \
	';
	t.equal('+++++[>++<-]>[-]',bf.clean(lineComment),"Line comment should be removed")
  t.end();
});

test("Custom BF",function(t){
	var app = 'R>I+I+I+I+I+I+I+I+I+S[L<I+I+I+I+I+I+I+I+R>M-E]L<O.';
	var options = {
		LANGUAGE : {
			INCREMENT      : 'I'.charCodeAt(0),
			DECREMENT      : 'M'.charCodeAt(0),
			POINTER_NEXT   : 'R'.charCodeAt(0),
			POINTER_PREV   : 'L'.charCodeAt(0),
			WHILE_BEGIN    : 'S'.charCodeAt(0),
			WHILE_END      : 'E'.charCodeAt(0),
			OUTPUT         : 'O'.charCodeAt(0),
			INPUT          : '_'.charCodeAt(0)
		}
	};
	var bf = new Brainfuck(app,options);
	t.equal(bf.application,'RIIIIIIIIISLIIIIIIIIRMELO',"Default operators should be replaced");
	t.equal(bf.compile(),'H',"Output should be the letter H");
	t.end();
});