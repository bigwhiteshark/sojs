define(function(require,exports,module){
	var Computer = require('mods/computer.js');
	var Printer = require('mods/printer.js');
	var str = require('mods/str.js');
	console.log(str)

    var computer = new Computer;
    var printer = new Printer;
    var sum = computer.add(5,4);
    printer.echo(sum)
});