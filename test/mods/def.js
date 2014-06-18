define('mods/def.js',['mods/dep'], function(require, exports, module) {
	//exports.a = dep;
	function Def(){

	}
	var p = Def.prototype;
	p.output = function(a){
		console.log(a)
	}

	return Def
});