define(function(require,exports,module){
	console.log('main mods');;
	var Computer = require('mods/computer');	
	console.log(Computer)
	var obj = require('mods/obj');
	console.log(obj)

	var Printer = require('mods/printer');
    var printer = new Printer;
     printer.echo('this is printer')

	var str = require('mods/str');
	console.log(str)

	require('mods/util',function(o){
		console.log(o.multify(3,5))
	});
	var util = require('mods/util');
	console.log(util.multify(6,3))

	/*var def = require('mods/def');
	(new def).output('sss')*/
		
    var computer = new Computer;
    
    var sum = computer.add(5,4);
    printer.echo(sum)

    require(['mods/util','mods/computer'],function(a,b){
    	console.log(a);
    	console.log(b);
		console.log(a.multify(8,5))
	});

	require(['mods/str','mods/printer'],function(a,b){
    	console.log(a);
    	console.log(b);
	});
    
});