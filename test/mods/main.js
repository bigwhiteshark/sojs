require(function(exports,module){
	var Computer = require('mods/computer.js');
	var Printer = require('mods/printer.js');

    var computer = new Computer;
    var printer = new Printer;
    var sum = computer.add(5,4);
    printer.echo(sum)
});