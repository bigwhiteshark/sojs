define(function(require,exports,module){
	function Rel(){
	}
	var p = Rel.prototype;
	p.add = function(a,b){
		return a+b
	}
	p.say = function(msg){
		console.log(msg)
	}
	console.log('Rel mods')
	module.exports = Rel
})