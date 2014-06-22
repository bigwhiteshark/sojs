define(function(require,exports,module){
	function Dep(){
	}
	var p = Dep.prototype;
	p.add = function(a,b){
		return a+b
	}
	p.say = function(msg){
		console.log(msg)
	}
	console.log('Dep mods')
	module.exports = Dep
})