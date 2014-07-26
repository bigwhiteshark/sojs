define('mods/def',['mods/internal','mods/indep'],function(require, exports, module) {
	console.log('def mods');
	//var InDep = require('mods/indep');
	var Dep = require('mods/dep');
	var Internal = require('mods/internal');
	function Def(){

	}
	var p = Def.prototype;
	p.output = function(a){
		var d = new Dep();
		d.say('I am dep object in def mods')
		console.log(a)
	}

	var internal = new Internal;
	internal.say();

	return Def
});

define('mods/internal',function(require,exports,module){ //sync deps no implement
	function Internal(){

	}
	var p = Internal.prototype;
	p.say = function(){
		console.log('I am internal mod')
	}
	 module.exports = Internal
})