define(function(require,exports,module){
	console.log(exports,module)
	function Computer(){
	}
	var p = Computer.prototype;
	p.add = function(a,b){
		return a+b
	}
	//exports.Computer = Computer
	module.exports = Computer
});