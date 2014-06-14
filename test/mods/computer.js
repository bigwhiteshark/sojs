define(function(require,exports,module){
	function Computer(){
	}
	var p = Computer.prototype;
	p.add = function(a,b){
		return a+b
	}
	module.exports = Computer
});