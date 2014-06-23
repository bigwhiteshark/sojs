define('mods/def.js',['mods/dep'], function(require, exports, module) {
	console.log('def mods');
	var Dep = require('mods/dep');
	function Def(){

	}
	var p = Def.prototype;
	p.output = function(a){
		var d = new Dep();
		d.say('I am dep object in def mods')
		console.log(a)
	}

	return Def
});