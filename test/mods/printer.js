require(function(exports,module){
	function Printer(){
	}
	var p = Printer.prototype;
	p.echo = function(msg){
		console.log(msg)
	}

	return Printer

})