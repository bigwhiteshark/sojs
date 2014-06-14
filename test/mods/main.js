define(function(require,exports,module){
	var Computer = require('mods/computer.js');
	var Printer = require('mods/printer.js');
	var obj = require('mods/obj.js');
	console.log(obj)
	var str = require('mods/str.js');
	console.log(str)

	require('mods/util.js',function(o){
		console.log(o.multify(3,5))
	});
	var util = require('mods/util.js');
	console.log(util.multify(6,3))

	/*var def = require('mods/def.js');
	(new def).output('sss')
*/
	//var dep = require('hello.js');
    var computer = new Computer;
    var printer = new Printer;
    var sum = computer.add(5,4);
    printer.echo(sum)

  /*  require(['mods/util.js','mods/computer.js'],function(a,b){
    	console.log(a);
    	console.log(b);
		//console.log(a.multify(3,5))
	});*/
    
});