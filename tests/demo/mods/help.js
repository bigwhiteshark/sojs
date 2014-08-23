define('mods/help',function(require,exports,module){
	var help = {
		mul:function(a,b){
			return a*b
		},
		sub:function(a,b){
			return a - b
		}
	}
	console.log('help mods');
	exports.mul = help.mul; 
});