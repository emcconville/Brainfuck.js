# [Brainf ck.js][bf]

## Installation

```
  shell~> npm install https://github.com/emcconville/Brainfuck.js/tarball/master
  shell~> grunt
  shell~> cp ./dist/Brainfuck.min.js /path/to/production
```

## Usage

### Basic [node.js][node]

``` javascript
var fs = require('fs'),
    hello = fs.readFileSync('test/example.bf'),
    Brainfuck = require('Brainfuck.js');

var bf = new Brainfuck(hello);
bf.compile();
//=> The quick brown fox jumps over the lazy dog
```

### CLI

```
 shell~> bf 'test/example.bf
 The quick brown fox jumps over the lazy dog
```

#### CLI Usage

```
   bf [-vvv] [--test] [--input <string>] filename\n\
```

#### CLI Options

```
   -f, --file <file>   : Set filename to interpret
   -i, --input <string>: Input string for application
   -t, --test          : Validate syntax without executing application
   -v, --version       : Print version information
   -vv                 : Print summary of application
   -vvv                : Print debug output on loop iterations
```

### API Methods

#### clean( str )

Strip out commented text from string

 * **str** *string* 

 * **returns** *string*

 * **example**
   ``` brainfuck
   /*
    * Blocklevel comment
    * 
    * If statement
    * [(condition true until 0)[-]]
    */
   +[[>++<-]-[-]] // Line comment
   ```

#### compile()

Interprets given bf application

 * **returns** *string|boolean* Output of application, or
   false on failure


#### init( application [, options] )

 * **application** *string* The bf application to compile
 * **options** *object (optional)* Run-time configuration
   options to adjust behavior of bf interpreter, and core
   language attributes.
   
 * **returns** *object*
 

#### merge( original, alternative )

Updated existing, or append new, attributes to existing
object

 * **original** *object* Base default item
 * **alternative** *object* New item to assimilate

#### read_input_buffer()

Return a single character from input buffer

 * **return** *integer* Value of input char, by base 10
   order

#### validate()

Examine application for syntax errors.

 * **return** *boolean* True on valid syntax, false otherwise

#### write_output_buffer( charCode )

Add char to output buffer

 * **charCode** *integer* Base 10 order

 * **return** *string* Character at given order

[node]: http://nodejs.org/ "node.js"
[bf]: http://en.wikipedia.org/wiki/Brainfuck "Brainfuck"