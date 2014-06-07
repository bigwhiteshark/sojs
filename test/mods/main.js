define(function(require,exports,module){
	var Computer = require('mods/computer.js');
	var Printer = require('mods/printer.js');
	var obj = require('mods/obj.js');
	console.log(obj)
	var str = require('mods/str.js');
	console.log(str)

    var computer = new Computer;
    var printer = new Printer;
    var sum = computer.add(5,4);
    printer.echo(sum)
});