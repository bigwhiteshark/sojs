define(function(require,exports,module){
	function Chi(){
	}
	var p = Chi.prototype;
	p.add = function(a,b){
		return a+b
	}
	p.say = function(msg){
		console.log(msg)
	}
	console.log('Chi mods')
	module.exports = Chi
})