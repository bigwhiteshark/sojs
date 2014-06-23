define(function(require,exports,module){
	function Point(){
	}
	var p = Point.prototype;
	p.say = function(msg){
		console.log(msg)
	}
	console.log('Point mods')
	module.exports = Point
});