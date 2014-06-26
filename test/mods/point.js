define(function(require){
	function Point(){
	}
	var p = Point.prototype;
	p.say = function(msg){
		console.log(msg)
	}
	console.log('Point mods')
	return Point
});