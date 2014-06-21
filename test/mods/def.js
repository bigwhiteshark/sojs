define('mods/def.js',['mods/dep'], function(require, exports, module) {
	//exports.a = dep;
	var Dep = require('mods/dep');
	function Def(){

	}
	var p = Def.prototype;
	p.output = function(a){
		console.log(a)
	}

	var d = new Dep();
	e.say('I am dep object in def mods')

	return Def
});