define(function(require,exports,module){
	function Dep(){
	}
	Dep.prototype.output=function(a){
		console.log(a)
	}
	console.log('dep mods')
	window.Dep = Dep;
	module.exports = Dep;
})