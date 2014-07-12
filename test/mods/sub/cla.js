define(function(require,exports,module){
	require('./rel');
	require('./view');
	require('mods/help')
	function Cla(){
	}
	var p = Cla.prototype;
	p.add = function(a,b){
		return a+b
	}
	p.say = function(msg){
		console.log(msg)
	}
	console.log('Cla mods')
	module.exports = Cla
})