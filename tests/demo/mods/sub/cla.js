define(function(require,exports,module){
	require('./rel');
	//console.log(require.lastId,'ddddddddddd');
	require('./child/chi');
	//console.log(require.lastId,'ssssssssss');
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