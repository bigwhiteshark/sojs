define(function(require,exports,module){
	console.log('computer.js')
	function Computer(){
	}
	var p = Computer.prototype;
	p.add = function(a,b){
		return a+b
	}
	module.exports = Computer
});