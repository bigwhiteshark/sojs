define(function(require,exports,module){
	var util = {
		mul:function(a,b){
			return a*b
		},
		sub:function(a,b){
			return a - b
		}
	}
	console.log('util mods')
	exports.multify = util.mul; 
});