define(function(exports,module){
	function Printer(){
	}
	var p = Printer.prototype;
	p.echo = function(msg){
		console.log(msg)
	}

	console.log('Printer mods')
	return Printer

})