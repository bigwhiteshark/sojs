define(function(require,exports,module){
	function Indep(){
	}
	var p = Indep.prototype;
	p.add = function(a,b){
		return a+b
	}
	p.say = function(msg){
		console.log(msg)
	}
	console.log('Indep mods')
	module.exports = Indep
})