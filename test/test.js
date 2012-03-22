var Brainfuck = require('../src/Brainfuck.js');
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
