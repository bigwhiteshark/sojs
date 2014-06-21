define(function(require,exports,module){
	function Dep(){
	}
	var p = Dep.prototype;
	p.add = function(a,b){
		return a+b
	}
	console.log('Dep mods')
	module.exports = Dep
})