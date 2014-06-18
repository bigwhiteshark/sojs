define(function(require,exports,module){
	function Computer(){
	}
	var p = Computer.prototype;
	p.add = function(a,b){
		return a+b
	}
	console.log('Computer mods')
	module.exports = Computer
});