require(function(exports,module){
	function Computer(){
	}
	var p = Computer.prototype;
	p.add = function(a,b){
		return a+b
	}
	return Computer
});